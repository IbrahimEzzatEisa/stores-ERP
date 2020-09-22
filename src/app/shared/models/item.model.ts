import { ItemUnits } from "src/app/shared/models/item-units.model";

export class Item {

    constructor(itemId?) {
        this.itemId = itemId
        this.itemUnits = [];
        this.itemFullCode = null;
    }
    
    itemGroupId: string;
    itemId: string;
    itemFullCode: string;
    itemName: string;
    itemTypeId: number;
    maxStoreLevel: number;
    minStoreLevel: number;
    reorderLevel: number;
    price: number;
    storeId: number;
    storeSectionId: number;
    itemYear: string;

    barcodeImg: string;
    itemUnits: ItemUnits[];

} 
