
export class StockTakingTrxItem {
    serial: number;
    lineNo: number;
    itemGroupId: string;
    itemId: string;
    unitId: string;
    quantity: number;
    actualQuantity: number;
    notes: string;
    factor: number;
    totalQuantity: number;
    difference: number;
    itemYear: number;
}

export class StockTakingTrxItemWithNames extends StockTakingTrxItem { 
    itemGroupName: string;
    itemName: string;
    unitName: string;
}

