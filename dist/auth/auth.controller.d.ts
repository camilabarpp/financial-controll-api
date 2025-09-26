import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/type/user.create.request.type';
import { UserResponseDTO } from 'src/user/type/user.response.type';
import { UserCredentialsDto } from 'src/user/type/user.credential.request.type';
import { User as Profile } from 'src/user/type/user.type';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(createUserDto: CreateUserDto): Promise<UserResponseDTO>;
    signIn(credentialsDto: UserCredentialsDto): Promise<{
        token: string;
    }>;
    getMe(user: Profile): Profile;
}
