"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth/auth.service");
const jwt_service_1 = require("../services/auth/jwt.service");
let AuthMiddleware = class AuthMiddleware {
    constructor(jwtService, authService) {
        this.jwtService = jwtService;
        this.authService = authService;
    }
    async use(req, res, next) {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ status: 'failure', message: 'Authorization header not found' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ status: 'failure', message: 'Unauthorized to access this route' });
        }
        const isValid = await this.jwtService.verifyAccessToken(token);
        if (!isValid) {
            return res.status(401).json({ status: 'failure', message: 'Unauthorized to access this route' });
        }
        let { user } = await this.authService.decodeToken(token);
        req.user = user;
        next();
    }
};
AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_service_1.JwtService,
        auth_service_1.AuthService])
], AuthMiddleware);
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.middleware.js.map