import { TransactionService } from './transaction.service';
import { User } from 'src/user/type/user.type';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    getTransactionBalance(user: User): Promise<import("./type/transaction.balance.response").TransactionBalanceResponse>;
    getRecentTransactions(user: User): Promise<import("./type/transaction.response").TransactionResponse[]>;
}
