import { Component, OnInit, Input } from '@angular/core';
import { NotifierService } from 'angular-notifier';

import { SwalService } from 'src/app/shared/services/swal.service';
import { ObjectStatus } from 'src/app/shared/enums';
import { Employee, EmployeesAsMembers } from 'src/app/shared/models';
import { EmployeesService } from 'src/app/shared/services/api/employees.service';

@Component({
  selector: 'app-stock-taking-trxes-employees',
  templateUrl: './stock-taking-trxes-employees.component.html'
})
export class StockTakingTrxesEmployeesComponent implements OnInit {

  _employees: EmployeesAsMembers[];
  @Input() 
  set employees(employeesList: EmployeesAsMembers[]) {
    this._employees = employeesList;
  }
  _serial: number;
  @Input() 
  set serial(serial: number) {
    this._serial = serial;
  }
  @Input() disableEdit: boolean;
  employeesList: Employee[];
  newEmployee: Employee = new Employee();

  isDeletedStatus: ObjectStatus = ObjectStatus.deleted;
  dropdownLoading: boolean = false;

  constructor( 
    private notifier: NotifierService,
    private swalService: SwalService,
    private employeesService: EmployeesService
    ) { }

  ngOnInit() {
    this.employeesList = [];
    this.getEmployeesListForDropdown();
  }

  getEmployeesListForDropdown() {
    this.dropdownLoading = true;
    this.employeesService.getAll().subscribe(
      res => {
        this.employeesList = res;
        this.dropdownLoading = false;
      },
      err => {
        this.dropdownLoading = false;
      }
    )
  }

  addNewEmployeeToList() {
    const redundantEmployee = this._employees.find(employee => employee.empId == this.newEmployee.empId);
    if(redundantEmployee) {
      return this.notifier.notify('error', 'الموظف موجود بالفعل!')
    }
    const member: EmployeesAsMembers = {
      serial: this._serial,
      empId: this.newEmployee.empId,
      status: ObjectStatus.created
    }
    this._employees.push(member);
    this.newEmployee = new Employee();
  }
  delete(rowIndex, employee: EmployeesAsMembers) {
    this.swalService.showRemoveConfirmation(
      this.employeesList.find(emp => emp.empId == employee.empId).empName
      ).then(
      data => {
        if(data.value) {
          if(this._employees[rowIndex].status === ObjectStatus.created) {
            this._employees.splice(rowIndex, 1)
          } else {
            this._employees[rowIndex].status = ObjectStatus.deleted;
          }
        }
      },
      dismiss => {}
    )
  }
  selectNewEmployee(employee: Employee) {
    this.newEmployee = employee;
  }

}
