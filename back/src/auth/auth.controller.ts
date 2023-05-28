import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dto/createUser.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
	constructor(
		private userService: UserService,
	){}


	@HttpCode(200)
	@Post('signin')
	SignIn() {
		
	}


	@Post('signup')
	SignUp(@Body() body: CreateUserDto) {
		this.userService.create(body.name, body.password);
	}


	@Post('signout')
	SignOut() {
		
	}





}
