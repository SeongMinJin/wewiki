import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './local.strategy';

@Controller('auth')
export class AuthController {
	constructor(
		private userService: UserService,
	){}


	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('signin')
	async SignIn(@Req() req: Request) {
		// return session Id or JWT
		return;
	}


	@Post('signup')
	async SignUp(@Body() body: CreateUserDto) {
		await this.userService.create(body.id, body.password);
	}


	@Post('signout')
	SignOut() {
		
	}





}
