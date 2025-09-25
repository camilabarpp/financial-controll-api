import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user-create-dto';
import { UserRole } from './entities/user-enum';
import { CredentialsDto } from '../auth/dto/credentials-dto';
import { UserUpdateDto } from './dto/user-update-dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { MailerService } from '@nestjs-modules/mailer';
export declare class UserService {
    private readonly userRepository;
    private mailerService;
    constructor(userRepository: Repository<User>, mailerService: MailerService);
    findUsers(queryDto: FindUsersQueryDto): Promise<{
        users: User[];
        total: number;
    }>;
    findUser(queryDto: FindUsersQueryDto): Promise<{
        users: User[];
        total: number;
    }>;
    findUserById(id: string): Promise<User>;
    updateUser(updateUserDto: UserUpdateDto, id: string): Promise<User>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    createAdmin(createUserDto: CreateUserDto): Promise<User>;
    private sendConfirmationEmail;
    deleteUser(id: string): Promise<void>;
    changePassword(id: string, password: string): Promise<void>;
    private generateHash;
    createAndEncryptPassword(createUserDto: CreateUserDto, role: UserRole): Promise<User>;
    checkCredentials(credentialsDto: CredentialsDto): Promise<User>;
}
