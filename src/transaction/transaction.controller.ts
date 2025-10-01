import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { TransactionService } from './transaction.service';
import { User } from 'src/user/type/user.type';

@UseGuards(AuthGuard())
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get('balance')
    async getTransactionBalance(@GetUser() user: User) {
        return this.transactionService.getTransactionsBalance(user.id);
    }

    @Get('recent')
    async getRecentTransactions(@GetUser() user: User) {
        return this.transactionService.getRecentTransactions(user.id);
    }
}
