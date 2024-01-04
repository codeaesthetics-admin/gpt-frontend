import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';

@Injectable()
export class JwtService {
  private readonly jwtSecretKey = process.env.JWT_SECRET;

  constructor(private readonly nestJwtService: NestJwtService) {}

  async generateAccessToken(user: User): Promise<string> {
    const payload = { sub: user };
    const options = { expiresIn: '1d' };
    return jwt.sign(payload, this.jwtSecretKey, options);
  }

  async verifyAccessToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, this.jwtSecretKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}
