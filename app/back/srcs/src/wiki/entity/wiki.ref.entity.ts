import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Wiki } from "./wiki.entity";

@Entity()
export class WikiRef {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Wiki, (wiki) => wiki.refered)
	source: Wiki;

	@ManyToOne(() => Wiki, (wiki) => wiki.refer)
	target: Wiki;
}