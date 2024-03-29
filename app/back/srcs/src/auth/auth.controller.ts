import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { throws } from 'assert';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.strategy';

@Controller('auth')
export class AuthController {
	constructor(
		private userService: UserService,
		private authService: AuthService,
	) { }

	@HttpCode(200)
	@UseGuards(LocalAuthGuard)
	@Post('signin')
	async signIn(@Req() req: Request) {
		// @ts-ignore
		if (req.session.user) {
			req.session.regenerate(err => {
				if (err) throw new HttpException({ reason: "Error on session regeneration" }, HttpStatus.INTERNAL_SERVER_ERROR);
			});
			// @ts-ignore
		} else { req.session.user = req.user?.name; }
		req.session.save(err => {
			if (err) throw new HttpException({ reason: "Error on session save" }, HttpStatus.INTERNAL_SERVER_ERROR);
		});
	}

	@Post('signup')
	async signUp(@Body() body: CreateUserDto) {
		await this.userService.create(body.id, body.password);
	}

	@Get('signout')
	signOut(@Req() req: Request) {
		req.session.destroy(err => {
			if (err) throw new HttpException({ reason: "Error on session destroy" }, HttpStatus.INTERNAL_SERVER_ERROR);
		});
	}

	@Get("check")
	async check(@Req() req: Request) {
		// @ts-ignore
		return await this.authService.check(req.session.user || "");
	}
}
