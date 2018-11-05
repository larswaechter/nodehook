"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controller_1 = require("./controller");
var WebhookRoutes = /** @class */ (function () {
    function WebhookRoutes() {
        this._router = new express_1.Router();
        this.controller = new controller_1.WebhookController();
        this.initRoutes();
    }
    Object.defineProperty(WebhookRoutes.prototype, "router", {
        get: function () {
            return this._router;
        },
        enumerable: true,
        configurable: true
    });
    WebhookRoutes.prototype.initRoutes = function () {
        this._router.post('/update/:key', this.controller.handleWebhookEvent);
    };
    return WebhookRoutes;
}());
exports.WebhookRoutes = WebhookRoutes;
//# sourceMappingURL=routes.js.map