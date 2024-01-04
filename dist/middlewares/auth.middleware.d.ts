import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/models/user.model';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtService } from '../services/auth/jwt.service';
interface AuthenticatedRequest extends Request {
    user: User;
}
export declare class AuthMiddleware implements NestMiddleware {
    private readonly jwtService;
    private readonly authService;
    constructor(jwtService: JwtService, authService: AuthService);
    use(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
}
export {};
