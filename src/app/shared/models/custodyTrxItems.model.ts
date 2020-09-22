export class CustodyTrxItems {

    constructor(params: {
        orderSerial: number,
        trxTypeId: number,
        fillWithDeafults?: boolean
    }) {
        this.serial = params.orderSerial;
        this.type = params.trxTypeId;

        // if (params.fillWithDeafults) {
        //     this.discountRatio = 0;
        //     this.discountValue = 0;
        //     this.net = 0;
        // }
    }

    type: number;
    serial: number;
    lineNo: number;
    itemGroupId: string;
    itemId: string;
    itemName: string;
    quantity: number;
    unitId: number;
    factor: number;
    notes: string;
    itemYear: number;
} 