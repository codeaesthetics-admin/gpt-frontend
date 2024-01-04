import { User } from '../../models/user.model';
export declare class AuthService {
    private readonly JWT_SECRET;
    generateToken(user: User): string;
    decodeToken(token: string): any;
}
