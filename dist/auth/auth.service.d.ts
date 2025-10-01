import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { CreateUserDto } from 'src/user/type/user.create.request';
import { UserCredentialsDto } from 'src/user/type/user.credential.request';
import { UserResponseDTO } from 'src/user/type/user.response';
import { UserService } from 'src/user/user.service';
export declare class AuthService {
    private readonly userService;
    private jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    register(userData: CreateUserDto): Promise<UserResponseDTO>;
    login(credentialsDto: UserCredentialsDto): Promise<{
        token: string;
    }>;
    getMe(userId: string): Promise<UserResponseDTO>;
    resetPassword(email: string): Promise<void>;
}
