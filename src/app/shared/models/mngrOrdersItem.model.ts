export class MngrOrdersItem {
    constructor(){
       this.serial=null;
       this.lineNo=null;
    }
    serial:number;
    lineNo:number;	
    itemGroupId	:string
    itemId	:string
    quantity:number;
    itemYear:number;
}

export class MngrOrdersItemWithNames extends MngrOrdersItem {
    itemGroupName:string
    itemName: string;
}
