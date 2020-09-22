import { TableConfig } from "src/app/shared/models";

interface TrxItemsTableColumns {
    openingPalance: TableConfig[],
    receiveNote: TableConfig[],
    itemOutOrder: TableConfig[],
    damagedSettlement: TableConfig[],
    returnDocument: TableConfig[],
    transferCustody: TableConfig[],

}

export const itemsTableColumns: TrxItemsTableColumns = {
    openingPalance: [
        {
            label: "الرقم",
            key: "lineNo",
            visible: true
        }, {
            label: "المجموعة",
            key: "itemGroupName",
            visible: true
        }, {
            label: "الصنف",
            key: "itemName",
            visible: true
        }, {
            label: "الوحدة",
            key: "unitName",
            visible: true
        }, {
            label: "الكمية",
            key: "quantity",
            visible: true
        }, {
            label: "ملاحظات",
            key: "notes",
            visible: true
        }
    ],
    receiveNote: [
        {
            label: "الرقم",
            key: "lineNo",
            visible: true
        }, {
            label: "المجموعة",
            key: "itemGroupName",
            visible: true
        }, {
            label: "الصنف",
            key: "itemName",
            visible: true
        }, {
            label: "الوحدة",
            key: "unitName",
            visible: true
        }, {
            label: "",
            key: "factor",
            visible: false // The factor of selected unit ... from units dropdown
        }, {
            label: "الكمية",
            key: "quantity",
            visible: true
        }, {
            label: "",
            key: "totalQuantity",
            visible: false // totalQuantity = quantity * factor
        }, {
            label: "السعر",
            key: "price",
            visible: true
        }, {
            label: "الخصم",
            key: "discountValue",
            visible: true
        }, {
            label: "إجمالى",
            key: "totalPrice", // totalPrice = (quantity * price) - discountValue
            visible: true
        }
    ],
    itemOutOrder: [
        {
            label: "الرقم",
            key: "lineNo",
            visible: true
        }, {
            label: "المجموعة",
            key: "itemGroupName",
            visible: true
        }, {
            label: "الصنف",
            key: "itemName",
            visible: true
        }, {
            label: "الوحدة",
            key: "unitName",
            visible: true
        }, {
            label: "",
            key: "factor",
            visible: false // The factor of selected unit ... from units dropdown
        }, {
            label: "الكمية المطلوبة",
            key: "demandQuantity",
            visible: true
        }, {
            label: "الكمية المصروفة",
            key: "quantity",
            visible: true
        }, {
            label: "",
            key: "totalQuantity",
            visible: false // totalQuantity = quantity * factor
        }, {
            label: "السعر",
            key: "price",
            visible: true
        }, {
            label: "إجمالى",
            key: "totalPrice", // totalPrice = quantity * price
            visible: true
        }, {
            label: "ملاحظات",
            key: "notes",
            visible: true
        }
    ],
    damagedSettlement: [
        {
            label: "الرقم",
            key: "lineNo",
            visible: true
        }, {
            label: "المجموعة",
            key: "itemGroupName",
            visible: true
        }, {
            label: "الصنف",
            key: "itemName",
            visible: true
        }, {
            label: "الوحدة",
            key: "unitName",
            visible: true
        }, {
            label: "الكمية",
            key: "quantity",
            visible: true
        }, {
            label: "ملاحظات",
            key: "notes",
            visible: true
        }
    ],
    returnDocument: [
        {
            label: "الرقم",
            key: "lineNo",
            visible: true
        }, {
            label: "المجموعة",
            key: "itemGroupName",
            visible: true
        },
        {
            label: "الصنف",
            key: "itemName",
            visible: true
        },
        {
            label: "الوحدة",
            key: "unitName",
            visible: true
        },
        {
            label: "الكمية",
            key: "quantity",
            visible: true
        },
        {
            label: "ملاحظات",
            key: "notes",
            visible: true
        },
        // {
        //     label: "يضاف للرصيد",
        //     key: "custodyToStore",
        //     visible: true
        // }
    ],
    transferCustody: [
        {
            label:"الرقم",
            key:"lineNo",
            visible: true
        },
        {
            label:"المجموعة",
            key:"itemGroupName",
            visible: true
        },
        {
            label:"الصنف",
            key:"itemName",
            visible: true
        },
        {
            label: "الوحدة",
            key: "unitName",
            visible: true
        },
        {
            label:"الكمية",
            key:"quantity",
            visible: true
        },
        {
            label:"ملاحظات",
            key:"notes",
            visible: true
        }
    ]
}