export class WorkPlace {

    constructor() {
        this.workPlaceId = null;
        this.workPlaceName= "";
        this.phone1=null;
        this.phone2=null;
        this.fax=null;
        this.address="";
    }

        workPlaceId:number;
        workPlaceName:string;
        phone1?:number;
        phone2?:number;
        fax?:number;
        address?:string;
} 