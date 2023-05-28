import { User } from "src/user/entity/user.entity";
import { Wiki } from "src/wiki/entity/wiki.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.comment)
	user: User;

	@ManyToOne(() => Wiki, (wiki) => wiki.comment)
	wiki: Wiki;

	@Column({
		nullable: false,
	})
	date: Date;

	@Column({
		nullable: false,
	})
	content: string;
	
}