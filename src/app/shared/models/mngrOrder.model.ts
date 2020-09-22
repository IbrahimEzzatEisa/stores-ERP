export class MngrOrder {
    constructor(){
        this.serial=null;
    }
    serial:number;
    userId:string;
    date:string;
    dateH:string;
    branchId:number;
    notes:string;
    approved:boolean;
    outOrder:boolean;
}
export class MngrOrderWithNames extends MngrOrder {
    branchName: string;
}
	