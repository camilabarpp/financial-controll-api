import { UserService } from './user.service';
import { CreateUserDto } from './dto/user-create-dto';
import { ReturnUserDto } from './dto/user-return-dto';
import { UserUpdateDto } from './dto/user-update-dto';
import { User } from './entities/user.entity';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findUsers(query: FindUsersQueryDto): Promise<{
        found: {
            users: User[];
            total: number;
        };
        message: string;
    }>;
    findUserById(id: any): Promise<ReturnUserDto>;
    updateUser(updateUserDto: UserUpdateDto, user: User, id: string): Promise<ReturnUserDto>;
    signUpUser(createUserDto: CreateUserDto): Promise<ReturnUserDto>;
    signUpAdmin(createUserDto: CreateUserDto): Promise<ReturnUserDto>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
}
