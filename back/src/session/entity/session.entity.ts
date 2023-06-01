import { Column, Entity, PrimaryColumn, Timestamp } from "typeorm";

@Entity()
export default class Session {
	@PrimaryColumn({
		type: 'character varying',
		nullable: false,
	})
	sid: string;

	@Column({
		type: 'simple-json',
		nullable: false,
	})
	sess: any;

	@Column({
		type: 'timestamp with time zone',
		nullable: false,
	})
	expire: Timestamp

}