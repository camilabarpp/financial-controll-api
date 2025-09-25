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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordDto = void 0;
const class_validator_1 = require("class-validator");
class ChangePasswordDto {
    password;
    passwordConfirmation;
}
exports.ChangePasswordDto = ChangePasswordDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Insert a valid password' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password is less than 8 characters' }),
    (0, class_validator_1.MaxLength)(32, { message: 'Password is greater then 32 characters' }),
    (0, class_validator_1.Matches)(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_.!@#$%^&*])/),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Insert a valid password' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password is less than 8 characters' }),
    (0, class_validator_1.MaxLength)(32, { message: 'Password is greater then 32 characters' }),
    (0, class_validator_1.Matches)(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-_.!@#$%^&*])/),
    __metadata("design:type", String)
], ChangePasswordDto.prototype, "passwordConfirmation", void 0);
//# sourceMappingURL=change-password.dto.js.map