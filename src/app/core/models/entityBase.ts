import { User } from "./user";

export class EntityBase {
	id: number;
	active: boolean;
	createDate: Date;
	changeDate: Date;
	createUser: User;
	changeUser: User;
	constructor() {
		this.active = true;
	}
}
