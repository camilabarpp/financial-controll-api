import { Controller, Get, Query, UseGuards, Body, Post, Put, Delete, Param, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { TransactionService } from './transaction.service';
import { User } from 'src/user/type/user.type';
import { PeriodType } from 'src/transaction/type/period-type.enum';
import { TransactionRequest } from './type/transaction.request';
import { TransactionResponse } from './type/transaction.response';

@UseGuards(AuthGuard())
@Controller('transactions')
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Get()
    async getTransactions(
        @GetUser() user: User, 
        @Query('period') period: PeriodType,
        @Query('search') search: string,
        @Query('sort') sort: 'ASC' | 'DESC',
        @Query('transactionType') transactionType: 'INCOME' | 'EXPENSE' | 'ALL',
        @Query('currentPage') currentPage: number = 1,
    ) {
        return this.transactionService.getTransactions(user.id, period, search, sort, transactionType, currentPage);
    }

    @Get('totals')
    async getTransactionTotals(@GetUser() user: User, @Query('period') period: PeriodType) {
        return this.transactionService.getTransactionsTotals(user.id, period);
    }

    @Get('balance')
    async getTransactionBalance(@GetUser() user: User) {
        return this.transactionService.getTransactionsBalance(user.id);
    }

    @Get('recent')
    async getRecentTransactions(@GetUser() user: User) {
        return this.transactionService.getRecentTransactions(user.id);
    }

    @HttpCode(201)
    @Post()
    async createTransaction(
        @GetUser() user: User,
        @Body() body: TransactionRequest
    ) : Promise<TransactionResponse> {
        return this.transactionService.createTransaction(user.id, body);
    }

    @Put(':id')
    async updateTransaction(
        @GetUser() user: User,
        @Param('id') id: string,
        @Body() body: Partial<TransactionRequest>
    ) : Promise<TransactionResponse> {
        return this.transactionService.updateTransaction(id, user.id, body);
    }

    @HttpCode(204)
    @Delete(':id')
    async deleteTransaction(
        @GetUser() user: User,
        @Param('id') id: string
    ) {
        await this.transactionService.deleteTransaction(id, user.id);
        return { success: true };
    }
}
