import { EmployeesAsMembers } from "./employees-as-members.model";

export class StoreTrxe {

    constructor(params: { trxTypeId: number }) {
        this.trxTypeId = params.trxTypeId
        this.trxSerial = null;
        this.storeTrxMembers = [];

    }

    trxTypeId: number;
    trxSerial: number;
    storeId: number;
    date?: string;
    dateH?: string;
    orderStatusId?: number;
    supplierId?: number;
    docDescription?: string;
    docNo?: string;
    docDate?: string;
    docDateH?: string;
    recipientId?: string;
    storeKeeperId?: number;
    storeManagerId?: number;
    notes?: string;
    total?: number;
    discountRatio?: number;
    discountValue?: number;
    net?: number;
    branchId?: number;
    branchManagerId?: number;
    tempReceiveNo?: number;
    tempReceiveDate?: string;
    tempReceiveDateH?: string;
    purchaseOrderNo?: string;
    purchaseOrderDate?: string;
    purchaseOrderDateH?: string;
    shippingDocNo?: string;
    shippingDate?: string;
    shippingDateH?: string;
    checkDocNo?: string;
    checkDate?: string;
    checkDateH?: string;
    pagesCount?: number;
    attachments?: string;
    demandBranchId?: number;
    recordNo?: string;
    ownerId?: number;
    deliveryPersonId?: number;
    orderSerial?: number;
    totalVat: number;
    workPlaceId?: number;
    techMemberId?: number;
    managerId?: number;
    receiveNoteNo?: number;
    receiveNoteDate?: string;
    receiveNoteDateH?: string;
    empId?: number;
    damageReason?: string;
    returnReason?: string;

    reasonId?: number;
    stockTakingSerial?: number;
    storeTrxMembers: EmployeesAsMembers[];


} 