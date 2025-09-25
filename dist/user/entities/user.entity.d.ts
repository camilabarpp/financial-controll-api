export declare class User {
    id: string;
    name: string;
    role: string;
    status: boolean;
    confirmationToken: string;
    recoverToken: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: string;
    salt: string;
    checkPassword(password: string): Promise<boolean>;
}
