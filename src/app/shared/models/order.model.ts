import { EmployeesAsMembers } from "./employees-as-members.model";

export class Order {

    constructor(params: { trxTypeId: number})  
    {
        this.trxTypeId = params.trxTypeId
        this.total = 0;
        this.discountValue = 0;
        this.totalVat = 0;
        this.net = 0;
        this.orderTrxMembers =[];
    }

    orderSerial: number;
    trxTypeId: number; 
    date: string;
    dateH: string;
    recordNo: string; // الرقم المطبوع
    pagesCount: number; 
    attachments: string;
    assignmentYear: number;
    assignmentSerial: number;
    branchId: number;
    managerId: number;
    storeManagerId: number;
    storeId: number;
    supplierId: number;
    docDescription: string;
    docNo: string;
    docDate: string;
    docDateH: string;
    recipientId: number;
    techMemberId: number;
    notes: string;
    storeKeeperId:number;
    total: number;
    discountValue: number;
    totalVat: number;
    net: number;
    orderTrxMembers:EmployeesAsMembers[];
    // "orderStatusId": 0,
    // "storeKeeperId": 0,
    // "storeManagerId": 0,
    // "tempReceiveNo": 0,
    // "tempReceiveDate": "2019-02-11T09:34:17.651Z",
    // "tempReceiveDateH": "string",
    // "shippingDocNo": "string",
    // "shippingDate": "2019-02-11T09:34:17.651Z",
    // "shippingDateH": "string",
    // "checkDocNo": "string",
    // "checkDate": "2019-02-11T09:34:17.651Z",
    // "checkDateH": "string",
    // "deliveryPerson": "string",
    // "branchManagerId": 0,
    // "discountRatio": 0,
}