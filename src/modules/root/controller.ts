import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'

export class RootController {
  @bind
  public async renderHome(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      res.render('layouts/home')
    } catch (err) {
      return next(err)
    }
  }
}
