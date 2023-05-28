import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';


@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User)
		private userRepositoy: Repository<User>,
	) {}

	async create(name: string, password: string) {
		const newUser = this.userRepositoy.create({
			name: name,
			password: password,
		})

		await this.userRepositoy.save(newUser);
	}
}
