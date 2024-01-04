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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../users/user.service");
const user_model_1 = require("../../models/user.model");
const bcrypt = require("bcrypt");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(userService, authService) {
        this.userService = userService;
        this.authService = authService;
    }
    async register(body) {
        try {
            let existingUser = await this.userService.findByEmail(body.email);
            if (existingUser) {
                return { statusCode: 409, status: 'false', error: "user already exists" };
            }
            const password = body === null || body === void 0 ? void 0 : body.password;
            if (!password) {
                return { statusCode: 400, status: 'password is missing' };
            }
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(body.password, saltRounds);
            const createdUser = await this.userService.create(Object.assign(Object.assign({}, body), { password: hashedPassword }));
            return { statusCode: 201, status: 'success', user: createdUser };
        }
        catch (err) {
            console.log(err);
            return { statusCode: 500, status: 'error', error: err };
        }
    }
    async login(body) {
        try {
            const user = await this.userService.findByEmail(body.email);
            if (!user) {
                return { statusCode: 404, status: 'user not found' };
            }
            const passwordMatches = await bcrypt.compare(body.password, user.password);
            if (!passwordMatches) {
                return { statusCode: 401, status: 'Invalid credentials' };
            }
            const token = this.authService.generateToken(user);
            return { statusCode: 200, status: 'success', token: token };
        }
        catch (err) {
            return { statusCode: 500, status: 'error' };
        }
    }
};
__decorate([
    (0, common_1.Post)('/register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_model_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map