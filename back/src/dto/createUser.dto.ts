import { IsNotEmpty } from "class-validator";

export class CreateUserDto {
	@IsNotEmpty()
	id: string;

	@IsNotEmpty()
	password: string;
}