import { Controller, Get, HttpCode, HttpException, HttpStatus, Post, Req } from '@nestjs/common';
import { Wiki } from './entity/wiki.entity';
import { WikiService } from './wiki.service';
import { Request } from 'express';

@Controller('wiki')
export class WikiController {

	constructor(
		private wikiService: WikiService,
	) {}


	@Get("find/all")
	async findAll() {
		return await this.wikiService.findAll();
	}

	@Post("create/new")
	@HttpCode(201)
	async createNew(@Req() req: Request) {
		return await this.wikiService.createNew(req.session.user);
	}
}
