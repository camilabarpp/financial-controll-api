import { Model } from 'mongoose';
import { User } from './type/user.schema';
import { CreateUserDto } from './type/user.create.request';
import { UserResponseDTO } from './type/user.response';
import { UpdateUserDto } from './type/user.update.request';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User>);
    register(createUserDto: CreateUserDto): Promise<User>;
    findUserByEmail(email: string): Promise<User>;
    updateUser(updateUserDto: UpdateUserDto, id: string): Promise<UserResponseDTO>;
    deleteUser(id: string): Promise<void>;
    changePassword(id: string, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<void>;
    checkCredentials(credentialsDto: any): Promise<User | null>;
    findUserLogged(id: string): Promise<User>;
    private findUserById;
    private generateHash;
    private createAndEncryptPassword;
    private checkPassword;
}
