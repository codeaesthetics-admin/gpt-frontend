"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const auth_middleware_1 = require("./middlewares/auth.middleware");
const query_model_1 = require("./models/query.model");
const user_model_1 = require("./models/user.model");
const answer_controller_1 = require("./services/answer/answer.controller");
const answer_service_1 = require("./services/answer/answer.service");
const auth_controller_1 = require("./services/auth/auth.controller");
const auth_service_1 = require("./services/auth/auth.service");
const jwt_service_1 = require("./services/auth/jwt.service");
const user_controller_1 = require("./services/users/user.controller");
const user_service_1 = require("./services/users/user.service");
const jwt_1 = require("@nestjs/jwt");
const objectid_controller_1 = require("./services/objectId/objectid.controller");
const query_controller_1 = require("./services/query/query.controller");
const openai_service_1 = require("./services/openai/openai.service");
const query_service_1 = require("./services/query/query.service");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            .forRoutes({ path: 'null', method: common_1.RequestMethod.ALL });
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb://127.0.0.1:27017/chat-bot'),
            mongoose_1.MongooseModule.forFeature([
                { name: user_model_1.User.name, schema: user_model_1.UserSchema },
                { name: query_model_1.Answer.name, schema: query_model_1.AnswerSchema },
                { name: query_model_1.Query.name, schema: query_model_1.QuerySchema }
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: '1d' },
            }),
        ],
        controllers: [user_controller_1.UserController, auth_controller_1.AuthController, query_controller_1.QueryController, answer_controller_1.AnswerController, objectid_controller_1.ObjectIdController],
        providers: [user_service_1.UserService, auth_service_1.AuthService, query_service_1.QueryService, answer_service_1.AnswerService, jwt_service_1.JwtService, openai_service_1.ChatGptAiService]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map