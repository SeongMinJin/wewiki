import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
	) {}

	
	async validate(name: string, password: string): Promise<any> {
		const user = await this.userService.findOne(name);
		return user ? user.password === password ? user : null : null;
	}

	
}
