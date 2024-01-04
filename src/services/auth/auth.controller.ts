import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus } from '@nestjs/common';
import { UserService } from '../users/user.service';
import { User } from '../../models/user.model';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService,
        private readonly authService: AuthService
    ) { }

    @Post('/register')
    async register(@Body() body: User): Promise<{ statusCode: number, status: string, user?: User, error?}> {
        try {
            let existingUser = await this.userService.findByEmail(body.email);
            if (existingUser) {
                return { statusCode: 409, status: 'false', error: "user already exists" };
            }

            const password = body?.password;
            if (!password) {
                return { statusCode: 400, status: 'password is missing' };
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(body.password, saltRounds);
            const createdUser = await this.userService.create({ ...body, password: hashedPassword });
            return { statusCode: 201, status: 'success', user: createdUser };
        } catch (err) {
            console.log(err)
            return { statusCode: 500, status: 'error', error: err };
        }
    }

    @Post('/login')
    async login(@Body() body: User): Promise<{ statusCode: number, status: string, user?: User, token?: string, error?}> {
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
        } catch (err) {
            return { statusCode: 500, status: 'error' };
        }
    }
}
