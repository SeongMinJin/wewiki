import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
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
	async SignIn(@Req() req: Request, @Res() res: Response) {
		
		res.cookie("IamYourFather", req.session.id);
	}


	@Post('signup')
	async SignUp(@Body() body: CreateUserDto) {
		await this.userService.create(body.id, body.password);
	}


	@Post('signout')
	SignOut() {
		
	}





}
