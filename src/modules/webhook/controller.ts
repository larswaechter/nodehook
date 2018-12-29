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
        msg: 'New update for client: ' + req.params.token
      })

      return res.json({ status: res.statusCode, data: 'update received' })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public handleWebhookStop(
    req: Request,
    res: Response,
    next: NextFunction
  ): any {
    try {
      // emit ws event
      req.app.wsEvents.emit('emitStop', {
        token: req.params.token
      })

      return res.json({ status: res.statusCode, data: 'webhook stopped' })
    } catch (err) {
      return next(err)
    }
  }
}
