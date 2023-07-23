import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wiki } from './entity/wiki.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';

@Injectable()
export class WikiService {
	constructor(
		@InjectRepository(Wiki)
		private wikiRepository: Repository<Wiki>,
		private userService: UserService,
	) { }

	/**
	 * 
	 * @param name user(= owner)의 아이디
	 * @description Wiki Repository에서 바로 찾는것이 아니라
	 * 해당 유저를 불러와, 그 유저가 가지고 있는 모든 위키들을 반환하는 형식
	 */
	async findAll(name: string) {
		const user = await this.userService.findOneByName(name)
		return {
			"success": true,
			"data": {
				"wikies": user?.wiki,
				"relations": await this.makeRelations(name)
			}
		}
	}

	/**
	 * 
	 * @param name user(= owner)의 아이디
	 * @param id Wiki의 id
	 * @description findAll과는 다르게, Wiki Repository에서 바로 찾음.
	 * 그 유저가 가지고 있는 위키에서 직접 찾기보다 typeorm의 성능이 더 좋을거라
	 * 생각하기 때문에.
	 */
	async findOne(name: string, id: number) {
		return {
			"success": true,
			"data": await this.findOneByUser(await this.userService.findOneByName(name), id),
		}
	}

	/**
	 * 
	 * @param user 
	 * @param id 
	 * @returns 
	 */
	async findOneByUser(user: User | null, id: number) {
		return user ? await this.wikiRepository.findOne({
			where: {
				owner: user,
				id: id,
			}
		}) : null
	}

	/**
	 * 
	 * @param name user(= owner)의 아이디
	 * @description 해당 유저 wiki들의 관계 데이터를 만들어 반환해주는 함수
	 */
	async makeRelations(name: string) {
		const user = await this.userService.findOneByName(name);
		const wikies = user?.wiki;

		const links: {
			source: number,
			target: number,
		}[] = [];

		if (wikies) {
			for (const wiki of wikies) {
				for (const target of wiki.refer) {
					links.push({
						source: wiki.id,
						target: target.id,
					})
				}
			}
		}
		return links;
	}

	async createOne(name: string) {
		const user = await this.userService.findOneByName(name);
		if (user) {
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
}
