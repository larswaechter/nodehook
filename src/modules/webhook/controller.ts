import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'

export class WebhookController {
  @bind
  public handleWebhookEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): any {
    try {
      // emit ws event
      req.app.wsEvents.emit('emitUpdate', {
        token: req.params.token,
        body: JSON.stringify(req.body)
      })

      return res.json({ status: res.statusCode, data: 'update received' })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public handleWebhookClose(
    req: Request,
    res: Response,
    next: NextFunction
  ): any {
    try {
      // emit ws event
      req.app.wsEvents.emit('emitClose', {
        token: req.params.token
      })

      return res.json({ status: res.statusCode, data: 'websocket closed' })
    } catch (err) {
      return next(err)
    }
  }
}
