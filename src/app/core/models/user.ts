import { EntityBase } from "./entityBase";

export class User extends EntityBase {
		
	constructor(){
		super();
		this.id = 0;		
	}
	name: string;
	userName: string;
	mail: string;
	phone: string;
	password: string;	
	administrador: boolean;
	senhaAlterada: boolean;	
	userTypeId : number;
	partnerId: number;
	menusIds: number[] = [];
}
