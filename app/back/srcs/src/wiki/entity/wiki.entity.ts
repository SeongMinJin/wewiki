import { Comment } from "src/comment/entity/comment.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wiki {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.wiki)
	owner: User;

	@OneToMany(() => Comment, (comment) => comment.wiki)
	comment: Comment[];

	@Column()
	title: string;

	// need to be modified
	@Column()
	content: string;
}