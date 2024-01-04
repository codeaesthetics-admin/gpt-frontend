import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from '../../models/user.model';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET; // replace this with your own secret key

  generateToken(user: User): string {
    const payload = { user };
    const options = { expiresIn: '1d' };
    return jwt.sign(payload, this.JWT_SECRET, options);
  }

  decodeToken(token: string): any {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET);
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
