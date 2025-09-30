
import { Controller, Get, UseGuards, Req, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/type/user.create.request';
import { UserResponseDTO } from 'src/user/type/user.response';
import { UserCredentialsDto } from 'src/user/type/user.credential.request';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorator/get-user.decorator';
import { User as Profile } from 'src/user/type/user.type';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() createUserDto: CreateUserDto): Promise<UserResponseDTO> {
        return await this.authService.register(createUserDto);
    }

    @Post('signin')
    async signIn(@Body() credentialsDto: UserCredentialsDto): Promise<{ token: string }> {
        return await this.authService.login(credentialsDto);
    }

    @Get('/me')
    @UseGuards(AuthGuard())
    async getMe(@User() user: Profile): Promise<UserResponseDTO> {
      return await this.authService.getMe(user.id);
    }
}