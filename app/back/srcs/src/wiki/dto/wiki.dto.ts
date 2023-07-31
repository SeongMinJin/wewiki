import { IsInt, IsNotEmpty, Max, Min } from "class-validator";

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

	value: string | null;

	content: string | null;
}

export class WikiDeleteDto {
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(2147483647)
	id: number;
}

export class WikiConnectDto {
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(2147483647)
	source: number;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(2147483647)
	target: number;
}

export class WikiDisconnectDto {
	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(2147483647)
	source: number;

	@IsNotEmpty()
	@IsInt()
	@Min(1)
	@Max(2147483647)
	target: number;
}
