import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'

export class RootController {
  @bind
  public renderHome(req: Request, res: Response, next: NextFunction): any {
    try {
      return res.render('layouts/home')
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public renderHowTo(req: Request, res: Response, next: NextFunction): any {
    try {
      return res.render('layouts/howto')
    } catch (err) {
      return next(err)
    }
  }
}
