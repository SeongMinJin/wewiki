import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

export class WikiFindOneDto {
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(2147483647)
	id: number
}