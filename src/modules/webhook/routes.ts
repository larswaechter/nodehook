import { Router } from 'express'

import { WebhookController } from './controller'

export class WebhookRoutes {
  private readonly _router: Router = new Router()
  private readonly controller: WebhookController = new WebhookController()

  public constructor() {
    this.initRoutes()
  }

  public get router(): Router {
    return this._router
  }

  private initRoutes() {
    this._router.post('/update/:key', this.controller.handleWebhookEvent)
  }
}
