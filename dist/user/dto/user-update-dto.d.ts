import { UserRole } from '../entities/user-enum';
export declare class UserUpdateDto {
    name: string;
    email: string;
    role: UserRole;
    status: boolean;
}
