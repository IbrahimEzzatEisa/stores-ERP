export class orderItems {

    constructor(params: {
        orderSerial: number,
        trxTypeId: number,
        fillWithDeafults?: boolean
    }) {
        this.orderSerial = params.orderSerial;
        this.trxTypeId = params.trxTypeId;

        if (params.fillWithDeafults) {
            this.discountRatio = 0;
            this.discountValue = 0;
            this.net = 0;
        }
    }

    trxTypeId :number;
    orderSerial	:number;
    lineNo :number;
    itemGroupId: string;
    itemId:	string;
    unitId	:number;
    quantity: number;
    price: number;
    totalPrice: number; // price * quantity - discount value
    discountRatio: number; // 0
    discountValue: number; // 0
    net: number;
    notes: string;
    recipientId: number;
    demandQuantity: number;
    actualQuantity: number;
    factor: number; // units
    totalQuantity: number; // quantity * factor
    itemName: string;
    itemYear: number; // service

}