

import { Controller, Get, Post, Patch, Delete, Query, Param, Body, Req, Res, ForbiddenException, NotFoundException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from './user.service';
import { UserRole } from './type/user-role.enum';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findUsers(@Query() query: any) {
        const found = await this.userService.findUsers(query);
        return {
            found,
            message: 'Users found',
        };
    }

    @Get(':id')
    async findUserById(@Param('id') id: string) {
        const user = await this.userService.findUserById(id);
        return {
            user,
            message: 'User found successfully!',
        };
    }

    @Patch(':id')
    async updateUser(@Body() updateUserDto: any, @Req() req: Request, @Param('id') id: string) {
        // Exemplo de autorização: só admin ou o próprio usuário pode editar
        // Adapte para seu sistema de autenticação real
        const auth = req.headers['authorization'];
        if (!auth || !auth.startsWith('Bearer ')) {
            throw new ForbiddenException('Not authorized');
        }
        const token = auth.replace('Bearer ', '');
        const user = await this.userService.findByToken(token);
        if (!user || (user.role !== UserRole.ADMIN && user.id.toString() !== id)) {
            throw new ForbiddenException('You are not authorized to access this resource.');
        }
        const updated = await this.userService.updateUser(updateUserDto, id);
        return {
            user: updated,
            message: 'User updated successfully!',
        };
    }

    // @Post('admin')
    // Método comentado temporariamente para evitar erro. Ajuste e descomente quando necessário.
    // async signUpAdmin(@Body() createUserDto: any, @Req() req: Request) {
    //     // Exemplo de autorização: só admin pode criar admin
    //     const auth = req.headers['authorization'];
    //     if (!auth || !auth.startsWith('Bearer ')) {
    //         throw new ForbiddenException('Not authorized');
    //     }
    //     const token = auth.replace('Bearer ', '');
    //     const user = await this.userService.findByToken(token);
    //     if (!user || user.role !== UserRole.ADMIN) {
    //         throw new ForbiddenException('Only admin can create admin');
    //     }
    //     const admin = await this.userService.createAdmin(createUserDto);
    //     return {
    //         user: admin,
    //         message: 'Admin created successfully!',
    //     };
    // }

    @Delete(':id')
    async deleteUser(@Param('id') id: string, @Req() req: Request) {
        // Exemplo de autorização: só admin pode deletar
        const auth = req.headers['authorization'];
        if (!auth || !auth.startsWith('Bearer ')) {
            throw new ForbiddenException('Not authorized');
        }
        const token = auth.replace('Bearer ', '');
        const user = await this.userService.findByToken(token);
        if (!user || user.role !== UserRole.ADMIN) {
            throw new ForbiddenException('Only admin can delete users');
        }
        await this.userService.deleteUser(id);
        return {
            message: 'User removed successfully!',
        };
    }
}
