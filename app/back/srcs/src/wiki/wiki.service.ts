import { HttpCode, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wiki } from './entity/wiki.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entity/user.entity';
import { WikiSaveDto } from './dto/wiki.dto';

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
		const user = await this.userService.findOneByName(name);
		const wiki = user?.wiki.find(wiki => wiki.id === id);

		if (!wiki) {
			throw new HttpException({
				"success": false,
				"message": "존재하지 않는 위키입니다."
			}, HttpStatus.NOT_FOUND)
		}

		return {
			"success": true,
			"data": wiki,
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


	async findContent(name: string, id: string) {
		const user = await this.userService.findOneByName(name);
		const wiki = user?.wiki.find(wiki => wiki.id === parseInt(id));

		if (!wiki) {
			throw new HttpException({
				"success": false,
				"message": "존재하지 않는 위키입니다."
			}, HttpStatus.NOT_FOUND);
		}

		return {
			"success": true,
			"data": wiki.content
		};

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
				value: "제목",
			});
			await this.wikiRepository.save(newWiki);
			return {
				"success": true,
				"data": newWiki,
			}
		}
	}

	async save(name: string, body: WikiSaveDto) {
		const user = await this.userService.findOneByName(name);

		const wiki = user?.wiki.find(wiki => wiki.id === body.id);
		if (!wiki) {
			throw new HttpException({
				"success": false,
				"message": "존재하지 않는 위키입니다."
			}, HttpStatus.NOT_FOUND)
		}

		if (body.value)
			wiki.value = body.value;

		if (body.content)
			wiki.content = body.content;

		await this.wikiRepository.save(wiki);

		return {
			success: true
		}
	}

	async remove(name: string, id: number) {
		const user = await this.userService.findOneByName(name);
		const wiki = user?.wiki.find(wiki => wiki.id === id);

		if (!wiki) {
			throw new HttpException({
				"success": false,
				"message": "존재하지 않는 위키입니다."
			}, HttpStatus.NOT_FOUND)
		}
		await this.wikiRepository.remove(wiki);
	}


	async connect(name: string, source: number, target: number) {
		const user = await this.userService.findOneByName(name);
		const sourceWiki = user?.wiki.find(wiki => wiki.id === source);
		const targetWiki = user?.wiki.find(wiki => wiki.id === target);

		if (!sourceWiki || !targetWiki) {
			throw new HttpException({
				"success": false,
				"message": "존재하지 않는 위키입니다."
			}, HttpStatus.NOT_FOUND);
		}

		if (sourceWiki.refer.find(wiki => wiki.id === target) || targetWiki.refer.find(wiki => wiki.id === source)) {
			return ({
				"success": false,
				"message": "이미 연결된 위키입니다."
			});
		}

		sourceWiki.refer.push(targetWiki);
		await this.wikiRepository.save(sourceWiki);
		return ({
			"success": true
		});
	}

	async disconnect(name: string, source: number, target: number) {
		const user = await this.userService.findOneByName(name);
		const sourceWiki = user?.wiki.find(wiki => wiki.id === source);
		const targetWiki = user?.wiki.find(wiki => wiki.id === target);

		if (!sourceWiki || !targetWiki) {
			throw new NotFoundException;
		}

		const sourceIndex = sourceWiki.refer.findIndex(wiki => wiki.id === target);
		const targetIndex = targetWiki.refer.findIndex(wiki => wiki.id === source);

		if (sourceIndex !== -1) {
			sourceWiki.refer.splice(sourceIndex, 1);
			await this.wikiRepository.save(sourceWiki);
		} else if (targetIndex !== -1) {
			targetWiki.refer.splice(targetIndex, 1);
			await this.wikiRepository.save(targetWiki);
		}
	}

}
