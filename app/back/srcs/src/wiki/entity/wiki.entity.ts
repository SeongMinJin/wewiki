import { Comment } from "src/comment/entity/comment.entity";
import { User } from "src/user/entity/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Wiki {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.wiki)
	owner: User;

	@OneToMany(() => Comment, (comment) => comment.wiki)
	comment: Comment[];

	@ManyToMany(() => Wiki)
	@JoinTable()
	refer: Wiki[];

	@Column()
	value: string;

	// need to be modified
	@Column({
		nullable: true,
	})
	content: string;
}