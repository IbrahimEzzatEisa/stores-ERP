export class Permission {

    constructor(haveAllPermissions?) {
        if(haveAllPermissions) {
            this.open = true;
            this.read = true;
            this.insert = true;
            this.update = true;
            this.delete = true;
            this.print = true;
        } else {
            this.open = false;
            this.read = false;
            this.insert = false;
            this.update = false;
            this.delete = false;
            this.print = false;
        }
    }
    delete?:boolean;
    insert?:boolean;
    open?:boolean;
    print?:boolean;
    read?:boolean;
    update?:boolean;
    formName?: string;
    menuId?: number;
} 
