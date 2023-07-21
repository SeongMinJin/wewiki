import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';


@Injectable()
export class UserService {

	constructor(
		@InjectRepository(User)
		private userRepositoy: Repository<User>,
	) {}

	async findOne(name: string) {
		return await this.userRepositoy.findOne({
			where: {
				name: name,
			}
		})
	}

	async create(name: string, password: string) {
		if (await this.findOne(name) !== null) {
			throw new HttpException({reason: "이미 사용중인 아이디입니다."}, HttpStatus.CONFLICT);
		}

		const newUser = this.userRepositoy.create({
			name: name,
			password: password,
			wiki: [],
			comment: [],
		})
		await this.userRepositoy.save(newUser);
	}
}
