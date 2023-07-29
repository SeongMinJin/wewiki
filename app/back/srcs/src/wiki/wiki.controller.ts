import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { WikiService } from './wiki.service';
import { Request } from 'express';
import { SessionGuard } from './guard/wiki.session.guard';
import { WikiDeleteDto, WikiFindOneDto, WikiSaveDto } from './dto/wiki.dto';

@Controller('wiki')
export class WikiController {

	constructor(
		private wikiService: WikiService,
	) {}

	@Get("find/all")
	@UseGuards(SessionGuard)
	async findAll(@Req() req: Request) {
		// @ts-ignore
		return await this.wikiService.findAll(req.session.user);
	}

	@Get("find/one")
	@UseGuards(SessionGuard)
	async findOne(@Req() req: Request, @Body() body: WikiFindOneDto) {
		// @ts-ignore
		return await this.wikiService.findOne(req.session.user || "", body.id)
	}

	@Get("find/content/:id")
	@UseGuards(SessionGuard)
	async findContent(@Req() req:Request, @Param("id") id: number) {

		// @ts-ignore
		return await this.wikiService.findContent(req.session.user || "", id);
	}

	@Post("create")
	@UseGuards(SessionGuard)
	@HttpCode(201)
	async createNew(@Req() req: Request) {
		// @ts-ignore
		return await this.wikiService.createOne(req.session.user || "");
	}


	@Put("save")
	@UseGuards(SessionGuard)
	@HttpCode(201)
	async save(@Req() req: Request, @Body() body: WikiSaveDto) {
		// @ts-ignore
		return await this.wikiService.save(req.session.user || "", body.id, body.title, body.content);
	}

	@Delete("remove")
	@UseGuards(SessionGuard)
	@HttpCode(204)
	async remove(@Req() req: Request, @Body() body: WikiDeleteDto) {
		// @ts-ignore
		return await this.wikiService.remove(req.session.user, body.id);
	}
}
