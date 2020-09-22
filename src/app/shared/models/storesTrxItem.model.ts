import { TrxTypeIds } from "src/app/shared/enums";

export class StoresTrxItem {

    constructor(params: {
        trxSerial: number,
        trxTypeId: number,
        fillWithDeafults?: boolean
    }) {
        this.trxSerial = params.trxSerial;
        this.trxTypeId = params.trxTypeId;

        if(params.fillWithDeafults && params.trxTypeId == TrxTypeIds.openingBalance) {
            this.demandQuantity = 0;
            this.discountRatio = 0;
            this.discountValue = 0;
            this.factor = 1;
            this.net = 0;
            this.price = 0;
            this.totalPrice = 0;
            this.totalQuantity = 0;
        } else if (params.fillWithDeafults && params.trxTypeId == TrxTypeIds.receiveNote) {
            this.demandQuantity = 0;
            this.discountRatio = 0;
            this.discountValue = 0;
            this.net = 0;
        } else if (params.fillWithDeafults && params.trxTypeId == TrxTypeIds.itemOutOrder) {
            this.discountRatio = 0;
            this.discountValue = 0;
            this.net = 0;
        }
    }
    trxSerial:number;
    trxTypeId:number
    lineNo: number;
    itemGroupId: string;
    itemGroupName: string;
    itemId: string;
    itemName: string;
    unitId: number;
    unitName: string;
    itemYear: number;
    quantity:number;
    notes:string;

    demandQuantity: number;
    discountRatio: number;
    discountValue: number;
    factor: number;
    net: number;
    price: number;
    totalPrice: number;
    totalQuantity: number;
    custodyToStore:boolean;
}