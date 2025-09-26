
import { Controller, Get, UseGuards, Req, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/type/user.create.request.type';
import { UserResponseDTO } from 'src/user/type/user.response.type';
import { UserCredentialsDto } from 'src/user/type/user.credential.request.type';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
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
  getMe(@User() user: Profile): Profile {
    return user;
  }

}