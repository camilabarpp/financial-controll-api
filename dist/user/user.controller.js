"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const user_create_dto_1 = require("./dto/user-create-dto");
const role_decorator_1 = require("../auth/role.decorator");
const user_enum_1 = require("./entities/user-enum");
const user_update_dto_1 = require("./dto/user-update-dto");
const get_user_decorator_1 = require("../auth/get-user.decorator");
const user_entity_1 = require("./entities/user.entity");
const find_users_query_dto_1 = require("./dto/find-users-query.dto");
const roles_guard_1 = require("../auth/roles.guard");
const passport_1 = require("@nestjs/passport");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async findUsers(query) {
        const found = await this.userService.findUsers(query);
        return {
            found,
            message: 'Users founded',
        };
    }
    async findUserById(id) {
        const user = await this.userService.findUserById(id);
        return {
            user,
            message: 'User found successfully!',
        };
    }
    async updateUser(updateUserDto, user, id) {
        if (user.role != user_enum_1.UserRole.ADMIN && user.id.toString() != id) {
            throw new common_1.ForbiddenException('You are not authorized to access this resource.');
        }
        else {
            const user = await this.userService.updateUser(updateUserDto, id);
            return {
                user,
                message: 'User updated successfully!',
            };
        }
    }
    async signUpUser(createUserDto) {
        const user = await this.userService.createUser(createUserDto);
        return {
            user,
            message: 'User created successfully!',
        };
    }
    async signUpAdmin(createUserDto) {
        const user = await this.userService.createAdmin(createUserDto);
        return {
            user,
            message: 'Admin created successfully!',
        };
    }
    async deleteUser(id) {
        await this.userService.deleteUser(id);
        return {
            message: 'User removed successfully!',
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, role_decorator_1.Role)(user_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [find_users_query_dto_1.FindUsersQueryDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, role_decorator_1.Role)(user_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_update_dto_1.UserUpdateDto,
        user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)('user'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_create_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signUpUser", null);
__decorate([
    (0, common_1.Post)('admin'),
    (0, role_decorator_1.Role)(user_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_create_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "signUpAdmin", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, role_decorator_1.Role)(user_enum_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('signUp'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map