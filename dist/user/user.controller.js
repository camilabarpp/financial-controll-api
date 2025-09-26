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
const user_role_enum_1 = require("./type/user-role.enum");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async findUsers(query) {
        const found = await this.userService.findUsers(query);
        return {
            found,
            message: 'Users found',
        };
    }
    async findUserById(id) {
        const user = await this.userService.findUserById(id);
        return {
            user,
            message: 'User found successfully!',
        };
    }
    async updateUser(updateUserDto, req, id) {
        const auth = req.headers['authorization'];
        if (!auth || !auth.startsWith('Bearer ')) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        const token = auth.replace('Bearer ', '');
        const user = await this.userService.findByToken(token);
        if (!user || (user.role !== user_role_enum_1.UserRole.ADMIN && user.id.toString() !== id)) {
            throw new common_1.ForbiddenException('You are not authorized to access this resource.');
        }
        const updated = await this.userService.updateUser(updateUserDto, id);
        return {
            user: updated,
            message: 'User updated successfully!',
        };
    }
    async deleteUser(id, req) {
        const auth = req.headers['authorization'];
        if (!auth || !auth.startsWith('Bearer ')) {
            throw new common_1.ForbiddenException('Not authorized');
        }
        const token = auth.replace('Bearer ', '');
        const user = await this.userService.findByToken(token);
        if (!user || user.role !== user_role_enum_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only admin can delete users');
        }
        await this.userService.deleteUser(id);
        return {
            message: 'User removed successfully!',
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUsers", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map