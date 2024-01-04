import { JwtService as NestJwtService } from '@nestjs/jwt';
import { User } from '../../models/user.model';
export declare class JwtService {
    private readonly nestJwtService;
    private readonly jwtSecretKey;
    constructor(nestJwtService: NestJwtService);
    generateAccessToken(user: User): Promise<string>;
    verifyAccessToken(token: string): Promise<boolean>;
}
