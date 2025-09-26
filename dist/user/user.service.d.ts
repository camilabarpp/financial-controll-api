import { Model } from 'mongoose';
import { User } from './type/user.schema';
import { UserRole } from './type/user-role.enum';
import { CreateUserDto } from './type/user.create.request.type';
import { UserResponseDTO } from './type/user.response.type';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User>);
    register(createUserDto: CreateUserDto): Promise<UserResponseDTO>;
    findByToken(token: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User>;
    findUsers(query: any): Promise<{
        users: User[];
        total: number;
    }>;
    findUserById(id: string): Promise<User>;
    updateUser(updateUserDto: any, id: string): Promise<User>;
    deleteUser(id: string): Promise<void>;
    changePassword(id: string, password: string): Promise<void>;
    private generateHash;
    createAndEncryptPassword(createUserDto: CreateUserDto, role: UserRole): Promise<User>;
    checkCredentials(credentialsDto: any): Promise<User | null>;
    checkPassword(user: User, password: string): Promise<boolean>;
}
