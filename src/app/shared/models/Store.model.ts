export class Store {

    constructor() {
        this.storeId = null;
        this.storeName = "";
    }

    storeId: number;
    storeName: string;
    storeTypeId?: string;
    storeKeeperId?: string;
    phone1?: string;
    phone2?: string;
    fax?: string;
    address?: string;
}