"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var http_1 = require("http");
var ws_1 = require("ws");
var events_1 = require("events");
var path_1 = require("path");
var globals_1 = require("./config/globals");
var routes_1 = require("./modules/webhook/routes");
var routes_2 = require("./modules/root/routes");
var Server = /** @class */ (function () {
    function Server() {
        this._app = express();
        this.port = globals_1.variables.port;
        this.wsEvents = new events_1.EventEmitter();
        this.wsSessions = {};
        this.server = http_1.createServer(this._app);
        this.wsServer = new ws_1.Server({
            server: this.server,
            path: '/api/websocket/listen'
        });
    }
    Object.defineProperty(Server.prototype, "app", {
        get: function () {
            return this._app;
        },
        enumerable: true,
        configurable: true
    });
    Server.prototype.start = function () {
        this.initConfig();
        this.initWebsocket();
        this.initRoutes();
        this.listen();
    };
    Server.prototype.initConfig = function () {
        this._app.use(bodyParser.json());
        this._app.use(bodyParser.urlencoded({ extended: true }));
        // set views and assets
        this.app.set('view engine', 'ejs');
        this.app.set('views', path_1.resolve('views'));
        this.app.use(express.static(path_1.resolve('public')));
    };
    Server.prototype.initWebsocket = function () {
        var _this = this;
        this.wsServer.on('connection', function (con, req) {
            var token = req.headers.token;
            if (token !== undefined &&
                token.length &&
                _this.wsSessions[token] === undefined) {
                // store new connection
                _this.wsSessions[token] = con;
                console.log('New connection stored: ' + token);
            }
            else if (_this.wsSessions[token].readyState !== _this.wsSessions[token].OPEN) {
                // user reconnected -> close old connection and store new one
                _this.wsSessions[token].close();
                _this.wsSessions[token] = con;
                console.log('Connection renewed: ' + token);
            }
            // triggered from stream controller
            _this.wsEvents.on('emitUpdate', function (data) {
                var _con = _this.wsSessions[data.token];
                if (_con !== undefined) {
                    _con.send(data.msg);
                    console.log('Event emitted: ' + data.msg);
                }
                else {
                    console.log('Unknown connection: ' + data.token);
                }
            });
        });
        // store events in app to access them from controller
        this._app.wsEvents = this.wsEvents;
    };
    Server.prototype.initRoutes = function () {
        this._app.use('/', new routes_2.RootRoutes().router);
        // socket stream
        this._app.use('/api/webhook', new routes_1.WebhookRoutes().router);
        // error handler
        this._app.use(function (err, req, res, next) {
            console.log(err);
            return res.status(500).json({
                status: 500,
                error: typeof err === 'object' ? err.message : err
            });
        });
    };
    Server.prototype.listen = function () {
        var _this = this;
        this.server.listen(this.port, function () {
            console.log("Server is listening on port " + _this.port);
        });
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map