import type { Request } from 'express';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findUsers(query: any): Promise<{
        found: {
            users: import("./type/user.schema").User[];
            total: number;
        };
        message: string;
    }>;
    findUserById(id: string): Promise<{
        user: import("./type/user.schema").User;
        message: string;
    }>;
    updateUser(updateUserDto: any, req: Request, id: string): Promise<{
        user: import("./type/user.schema").User;
        message: string;
    }>;
    deleteUser(id: string, req: Request): Promise<{
        message: string;
    }>;
}
