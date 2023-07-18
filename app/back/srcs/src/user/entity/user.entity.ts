import { Comment } from "src/comment/entity/comment.entity";
import { Wiki } from "src/wiki/entity/wiki.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		nullable: false,
	})
	name: string;

	@Column({
		nullable: false,
	})
	password: string;

	@OneToMany(() => Wiki, (wiki) => wiki.owner, {
		nullable: true,
	})
	wiki: Wiki[];

	@OneToMany(() => Comment, (comment) => comment.user, {
		nullable: true,
	})
	comment: Comment[];


}