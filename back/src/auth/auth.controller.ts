import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { throws } from 'assert';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.strategy';

@Controller('auth')
export class AuthController {
	constructor(
		private userService: UserService,
		private authService: AuthService,
	){}


	@HttpCode(200)
	// @UseGuards(LocalAuthGuard)
	@Post('signin')
	async SignIn(@Req() req: Request, @Res() res: Response) {
		req.session.user = req.user;
		req.session.save();
		res.cookie('IamYourFather', req.sessionID, {
			maxAge: 1000 * 60 * 60, // 1 hour
			httpOnly: true,
		})
		res.send('Ok');
	}



	@Post('signup')
	async SignUp(@Body() body: CreateUserDto) {
		await this.userService.create(body.id, body.password);
	}


	@Post('signout')
	SignOut() {

	}

	@Get('test')
	test(@Req() req: Request) {
		console.log(req.cookies);
		console.log(req.headers.cookie);
		console.log(req.sessionID);
	}





}
