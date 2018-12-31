import * as express from 'express'
import * as bodyParser from 'body-parser'

import { createServer, Server as HttpServer } from 'http'
import { Server as WebSocketServer, WebsocketConnection } from 'ws'
import { EventEmitter } from 'events'

import { variables } from './config/globals'

// module routes
import { RootRoutes } from './modules/root/routes'
import { WebhookRoutes } from './modules/webhook/routes'

export class Server {
  private readonly _app: express.Application = express()
  private readonly port: string | number = variables.port
  private readonly wsEvents: EventEmitter = new EventEmitter()
  private server: HttpServer
  private wsServer: WebSocketServer
  private wsSessions: object = {}

  public constructor() {
    this.server = createServer(this._app)
    this.wsServer = new WebSocketServer({
      server: this.server,
      path: '/api/websocket'
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
    this.app.set('views', 'views')
    this.app.use(express.static('public'))
  }

  private initWebsocket(): void {
    /**
     * new websocket connection -> store
     */
    this.wsServer.on('connection', (con, req) => {
      const token: string = req.headers.token

      if (
        token !== undefined &&
        token.length &&
        this.wsSessions[token] === undefined
      ) {
        // store new connection
        this.wsSessions[token] = con
        console.log('New ws connection stored: ' + token)
      } else if (
        this.wsSessions[token] !== undefined &&
        this.wsSessions[token].readyState !== this.wsSessions[token].OPEN
      ) {
        // user reconnected -> close old connection and store new one
        this.wsSessions[token].close()
        this.wsSessions[token] = con
        console.log('Ws connection renewed: ' + token)
      }
    })

    /**
     * triggered from webhook controller
     */
    this.wsEvents.on('emitUpdate', data => {
      const _con: WebsocketConnection = this.wsSessions[data.token]

      if (_con !== undefined) {
        _con.send(data.body)
        console.log('Update emitted: ' + data.token)
      } else {
        console.error('Unknown connection: ' + data.token)
      }
    })

    this.wsEvents.on('emitClose', data => {
      const _con: WebsocketConnection = this.wsSessions[data.token]

      if (_con !== undefined) {
        _con.close()
        delete this.wsSessions[data.token]
        console.log('Connection closed: ' + data.token)
      }
    })

    // store events in express app to make them accessible inside controllers
    this._app.wsEvents = this.wsEvents
  }

  private initRoutes(): void {
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
