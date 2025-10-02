
import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { PeriodType } from '../transaction/type/period-type.enum';
import { AuthGuard } from '@nestjs/passport';
import { User as UserProfile } from 'src/user/type/user.type';
import { GetUser } from 'src/common/decorator/get-user.decorator';

@UseGuards(AuthGuard())
@Controller('expenses')
export class ExpenseController {
	constructor(private readonly expenseService: ExpenseService) {}

	@Get()
	async getExpenses(
		@Query('period') period: PeriodType = PeriodType.MONTH,
		@GetUser() user: UserProfile
	) {
		return this.expenseService.getExpensesByPeriod(user.id, period);
	}
}
