import { ObjectStatus } from "src/app/shared/enums";

export class EmployeesAsMembers {
    serial: number;
    empId: number;
    notes?: string;
    status: ObjectStatus;
}