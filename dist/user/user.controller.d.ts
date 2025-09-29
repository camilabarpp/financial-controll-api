import { UserService } from './user.service';
import { UpdateUserDto } from './type/user.update.request';
import { UserResponseDTO } from './type/user.response';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    updateUser(updateUserDto: UpdateUserDto, id: string): Promise<UserResponseDTO>;
    deleteUser(id: string): Promise<void>;
    changePassword(id: string, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<void>;
}
