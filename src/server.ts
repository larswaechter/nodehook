import * as express from 'express'
import * as bodyParser from 'body-parser'

import { createServer, Server as HttpServer } from 'http'
import { Server as WebSocketServer, WebsocketConnection } from 'ws'
import { EventEmitter } from 'events'
import { resolve } from 'path'

import { variables } from './config/globals'

import { WebhookRoutes } from './modules/webhook/routes'
import { RootRoutes } from './modules/root/routes'

export class Server {
  private readonly _app: express.Application = express()
  private readonly port: string | number = variables.port
  private server: HttpServer
  private wsServer: WebSocketServer
  private wsEvents: EventEmitter = new EventEmitter()
  private wsSessions: object = {}

  public constructor() {
    this.server = createServer(this._app)
    this.wsServer = new WebSocketServer({
      server: this.server,
      path: '/api/websocket/listen'
    })
  }

  public get app(): express.Application {
    return this._app
  }

  public start(): void {
    this.initConfig()
    this.initWebsocket()
    this.initRoutes()
    this.listen()
  }

  private initConfig(): void {
    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({ extended: true }))

    // set views and assets
    this.app.set('view engine', 'ejs')
    this.app.set('views', resolve('views'))
    this.app.use(express.static(resolve('public')))
  }

  private initWebsocket(): void {
    this.wsServer.on('connection', (con, req) => {
      const token: string = req.headers.token

      if (
        token !== undefined &&
        token.length &&
        this.wsSessions[token] === undefined
      ) {
        // store new connection
        this.wsSessions[token] = con
        console.log('New connection stored: ' + token)
      } else if (
        this.wsSessions[token].readyState !== this.wsSessions[token].OPEN
      ) {
        // user reconnected -> close old connection and store new one
        this.wsSessions[token].close()
        this.wsSessions[token] = con
        console.log('Connection renewed: ' + token)
      }

      // triggered from stream controller
      this.wsEvents.on('emitUpdate', data => {
        const _con: WebsocketConnection = this.wsSessions[data.token]

        if (_con !== undefined) {
          _con.send(data.msg)
          console.log('Event emitted: ' + data.msg)
        } else {
          console.log('Unknown connection: ' + data.token)
        }
      })
    })

    // store events in app to access them from controller
    this._app.wsEvents = this.wsEvents
  }

  private initRoutes(): any {
    this._app.use('/', new RootRoutes().router)

    // socket stream
    this._app.use('/api/webhook', new WebhookRoutes().router)

    // error handler
    this._app.use((err, req, res, next) => {
      console.log(err)
      return res.status(500).json({
        status: 500,
        error: typeof err === 'object' ? err.message : err
      })
    })
  }

  private listen(): void {
    this.server.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`)
    })
  }
}
