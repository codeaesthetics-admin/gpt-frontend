import { UserService } from '../users/user.service';
import { User } from '../../models/user.model';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    register(body: User): Promise<{
        statusCode: number;
        status: string;
        user?: User;
        error?: any;
    }>;
    login(body: User): Promise<{
        statusCode: number;
        status: string;
        user?: User;
        token?: string;
        error?: any;
    }>;
}
