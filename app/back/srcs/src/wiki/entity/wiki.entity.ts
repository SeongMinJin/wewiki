import { Comment } from "src/comment/entity/comment.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { WikiRef } from "./wiki.ref.entity";

@Entity()
export class Wiki {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: true,
		nullable: true
	})
	hd: string;

	@ManyToOne(() => User, (user) => user.wiki)
	owner: User;

	@OneToMany(() => Comment, (comment) => comment.wiki)
	comment: Comment[];

	@OneToMany(() => WikiRef, (wikiRef) => wikiRef.source)
	refer: WikiRef[];

	@OneToMany(() => WikiRef, (wikiRef) => wikiRef.target)
	refered: WikiRef[];

	@Column()
	value: string;

	@Column({
		nullable: true,
	})
	content: string;
}