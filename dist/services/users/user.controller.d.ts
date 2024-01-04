import { UserService } from './user.service';
import { User } from '../../models/user.model';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(): Promise<{
        status: string;
        users: User[];
    } | {
        status: string;
    }>;
    findOne(id: string): Promise<{
        status: string;
        user?: User;
    }>;
    create(user: User): Promise<{
        status: string;
        user?: User;
    }>;
    update(id: string, user: User): Promise<{
        status: string;
        user?: User;
    }>;
    remove(id: string): Promise<{
        status: string;
        user?: User;
    }>;
}
