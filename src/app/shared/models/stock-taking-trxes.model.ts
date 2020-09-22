import { EmployeesAsMembers } from "./employees-as-members.model";

export class StockTakingTrxe {

    constructor() {
        this.stockTakingTrxMembers = [];
    }

    serial: number;
    storeId: number;
    // docNo: string;
    date: string;
    dateH: string;
    stockTakingTypeId: number;
    // empId: number;
    storeKeeperId: number;
    storeManagerId: number;
    notes: string;
    // trxSerialPlus: number;
    // trxSerialMinus: number;
    endDate: string;
    endDateH: string;
    attachments: string;
    pagesCount: number;
    itemGroupId: string;
    stockTakingTrxMembers: EmployeesAsMembers[];
}

export class StockTakingTrxeWithNames extends StockTakingTrxe {
    storeName: string;
    stockTakingTypeName: string;
    storeKeeperName: string;
    storeManagerName: string;
    itemGroupName: string;
}