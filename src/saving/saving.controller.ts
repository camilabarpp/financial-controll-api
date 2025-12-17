import { Controller, Get, Query, UseGuards, Body, Post, Put, Delete, Param, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SavingService } from './saving.service';
import { SavingRequest } from './type/saving.request';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { User } from 'src/user/type/user.schema';
import { PeriodType } from 'src/transaction/type/period-type.enum';
import { SavingTransactionRequest } from './type/saving.transaction.request';

@UseGuards(AuthGuard())
@Controller('savings')
export class SavingController {
    constructor(private readonly savingService: SavingService) {}

    @Get()
    async getSavingsByUser(
        @GetUser() user: User,
        @Query('period') period: PeriodType,
        @Query('search') search: string,
        @Query('sort') sort: 'ASC' | 'DESC',
        @Query('currentPage') currentPage: number = 1,
    ) {
        return this.savingService.getSavingsByUser(user.id, period, search, sort, currentPage);
    }

    @Get('totals')
    async getSavingTotals(@GetUser() user: User) {
        return this.savingService.getSavingTotals(user.id);
    }

    @Get(':id/detail')
    async getSavingById(
        @GetUser() user: User,
        @Param('id') savingId: string,
        @Query('transactionPage') transactionPage: number = 1
    ) {
        return this.savingService.getSavingById(user.id, savingId, transactionPage);
    }

    @Get(':id/semester-transactions')
    async getSemesterTransactionsBySaving(
        @GetUser() user: User,
        @Param('id') savingId: string
    ) {
        return this.savingService.getSemesterTransactionsBySaving(user.id, savingId);
    }

    @Post(':id/transactions')
    async createSavingTransaction(
        @GetUser() user: User,
        @Param('id') savingId: string,
        @Body() body: SavingTransactionRequest
    ) {
        return this.savingService.createSavingTransaction(user.id, savingId, body);
    }

    @Put(':savingId/transactions/:transactionId')
    async updateSavingTransaction(
        @GetUser() user: User,
        @Param('savingId') savingId: string,
        @Param('transactionId') transactionId: string,
        @Body() body: Partial<SavingTransactionRequest>
    ) {
        return this.savingService.updateSavingTransaction(user.id, savingId, transactionId, body);
    }

    @Delete(':savingId/transactions/:transactionId')
    async deleteSavingTransaction(
        @GetUser() user: User,
        @Param('savingId') savingId: string,
        @Param('transactionId') transactionId: string
    ) {
        return this.savingService.deleteSavingTransaction(user.id, savingId, transactionId);
    }

    @HttpCode(201)
    @Post()
    async createSaving(
        @GetUser() user: User,
        @Body() body: SavingRequest
    ) {
        return this.savingService.createSaving(user.id, body);
    }

    @Put(':id')
    async updateSaving(
        @GetUser() user: User,
        @Param('id') savingId: string,
        @Body() body: Partial<SavingRequest>
    ) {
        return this.savingService.updateSaving(user.id, savingId, body);
    }

    @HttpCode(204)
    @Delete(':id')
    async deleteSaving(
        @GetUser() user: User,
        @Param('id') savingId: string
    ) {
        return this.savingService.deleteSaving(user.id, savingId);
    }
}
