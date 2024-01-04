// Import the necessary modules and components
import { Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { Answer, AnswerSchema, Query, QuerySchema } from './models/query.model';
import { User, UserSchema } from './models/user.model';
import { AnswerController } from './services/answer/answer.controller';
import { AnswerService } from './services/answer/answer.service';
import { AuthController } from './services/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { JwtService } from './services/auth/jwt.service';
import { UserController } from './services/users/user.controller';
import { UserService } from './services/users/user.service';
import { JwtModule } from '@nestjs/jwt';
import { ObjectIdController } from './services/objectId/objectid.controller';

// In QueryController we are handling all the queries asked by the user
import { QueryController } from './services/query/query.controller';

// In ChatGptAiService service/component we are handling API call's to OPENAI API;
import { ChatGptAiService } from './services/openai/openai.service';
import { QueryService } from './services/query/query.service';

// Define the application module
@Module({
  // Import the necessary modules
  imports: [
    // Connect to the MongoDB database
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/chat-bot'),
    // Define the database models for the application
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Answer.name, schema: AnswerSchema },
      { name: Query.name, schema: QuerySchema }
    ]),
    // Set up the JWT module for authentication
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  // Define the controllers for the application
  controllers: [UserController, AuthController, QueryController, AnswerController, ObjectIdController],
  // Define the services for the application
  providers: [UserService, AuthService, QueryService, AnswerService, JwtService, ChatGptAiService]
})
export class AppModule {
  // Define the middleware for the application
  configure(consumer: any) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'null', method: RequestMethod.ALL });
  }
}
