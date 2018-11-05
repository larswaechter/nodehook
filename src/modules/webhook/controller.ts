import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'

export class WebhookController {
  @bind
  public async handleWebhookEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // emit ws event
      req.app.wsEvents.emit('emitUpdate', {
        token: req.params.key,
        msg: 'New update for client: ' + req.params.key
      })

      res.json({ status: res.statusCode, data: 'update received' })
    } catch (err) {
      return next(err)
    }
  }
}
