export class User {

    constructor() {
        this.userId = "";
        this.userName= "";
        this.notActive=false;
        this.ignoreAutoSerial=false;
        this.onlyMenuId=null;
    }

    userId: string;
    userName: string;
    notActive?:boolean;
    ignoreAutoSerial?:boolean;
    onlyMenuId?:number;
    isNullPassword?: string;
    rowStatus?: null;
    menuName?:string;
} 