import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wiki } from './entity/wiki.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WikiService {
	constructor(
		@InjectRepository(Wiki)
		private wikiRepository: Repository<Wiki>,
		private userService: UserService,
	) {}

	async findAll() {
		return {
			"success": true,
			"data": await this.wikiRepository.find(),
		}
	}

	async createNew(name?: string) {
		const user = await this.userService.findOne(name || "");
		if (!user) {
			throw new HttpException({
				"success": false,
				"message": "로그인 해주세요."
			}, HttpStatus.UNAUTHORIZED)
		}

		const newWiki = this.wikiRepository.create({
			owner: user,
			title: "",
		});
		await this.wikiRepository.save(newWiki);
		return {
			"success": true,
			"data": newWiki,
		}
	}
}
