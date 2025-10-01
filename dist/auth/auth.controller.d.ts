import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/type/user.create.request';
import { UserResponseDTO } from 'src/user/type/user.response';
import { UserCredentialsDto } from 'src/user/type/user.credential.request';
import { User as Profile } from 'src/user/type/user.type';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(createUserDto: CreateUserDto): Promise<UserResponseDTO>;
    signIn(credentialsDto: UserCredentialsDto): Promise<{
        token: string;
    }>;
    getMe(user: Profile): Promise<UserResponseDTO>;
}
