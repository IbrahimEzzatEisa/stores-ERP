export class CustodyTrx {
  type: number;
  serial: number;
  date: string;
  dateH: string;
  empId: number;
  notes: string;
  toEmpId: number;
  orderSerial: number;
  transferSerial: number;
  branchManagerId: number;
  ownerId: number;
}


export class CustodyTrxWithNames extends CustodyTrx {
  empName: string;
  toEmpName: string;
  ownerName: string;
  branchManagerName: string;
}