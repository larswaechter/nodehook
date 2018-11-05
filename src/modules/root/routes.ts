import { Router } from 'express'

import { RootController } from './controller'

export class RootRoutes {
  private readonly _router: Router = new Router()
  private readonly controller: RootController = new RootController()

  public constructor() {
    this.initRoutes()
  }

  public get router(): Router {
    return this._router
  }

  private initRoutes() {
    this._router.get('/', this.controller.renderHome)
  }
}
