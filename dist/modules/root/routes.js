"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var controller_1 = require("./controller");
var RootRoutes = /** @class */ (function () {
    function RootRoutes() {
        this._router = new express_1.Router();
        this.controller = new controller_1.RootController();
        this.initRoutes();
    }
    Object.defineProperty(RootRoutes.prototype, "router", {
        get: function () {
            return this._router;
        },
        enumerable: true,
        configurable: true
    });
    RootRoutes.prototype.initRoutes = function () {
        this._router.get('/', this.controller.renderHome);
    };
    return RootRoutes;
}());
exports.RootRoutes = RootRoutes;
//# sourceMappingURL=routes.js.map