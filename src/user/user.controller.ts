

import { Controller, Patch, Delete, Param, Body, HttpCode, Put, ForbiddenException, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './type/user.update.request';
import { UserResponseDTO } from './type/user.response';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard())
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Put(':id')
    async updateUser(
        @Body() updateUserDto: UpdateUserDto,
        @Param('id') id: string
    ): Promise<UserResponseDTO> {
        return await this.userService.updateUser(updateUserDto, id);
    }

    @Delete(':id')
    @HttpCode(204)
    async deleteUser(@Param('id') id: string) {
      await this.userService.deleteUser(id);
    }

    @Patch(':id/change-password')
    async changePassword(@Param('id') id: string, @Body() body: { currentPassword: string, newPassword: string }) {
        await this.userService.changePassword(id, body)
    }
}
