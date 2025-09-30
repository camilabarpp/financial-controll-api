import { Document } from 'mongoose';
import { UserRole } from './type/user-role.enum';
export declare class User extends Document {
    name: string;
    email: string;
    password: string;
    avatar: string;
    role: UserRole;
    status: boolean;
    confirmationToken: string;
    recoverToken: string;
    salt: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any, {}> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
