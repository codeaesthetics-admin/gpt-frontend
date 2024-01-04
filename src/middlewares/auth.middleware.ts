import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/models/user.model';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtService } from '../services/auth/jwt.service';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) { }

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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
    req.user = user
    next();
  }
}
