import { IsInt, IsNotEmpty, IsString, Max, Min } from "class-validator";

export class WikiFindOneDto {
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(2147483647)
	id: number
}

export class WikiSaveDto {
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(2147483647)
	id: number;

	@IsNotEmpty()
	@IsString()
	title: string;


	@IsNotEmpty()
	@IsString()
	content: string;
}