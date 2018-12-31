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

  private initRoutes(): void {
    this._router.post('/update/:token', this.controller.handleWebhookEvent)
    this._router.post('/close/:token', this.controller.handleWebhookClose)
  }
}
