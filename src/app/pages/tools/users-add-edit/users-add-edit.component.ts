import { Component, OnInit, ViewChild } from '@angular/core';
import { User, Permission, ResultWithRanking, Menu } from 'src/app/shared/models';
import { UsersService, MenusDropDownService, ResetPasswordService, SwalService, PermissionsService, PERMISSIONS } from 'src/app/shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-users-add-edit',
  templateUrl: './users-add-edit.component.html',
  styleUrls: ['./users-add-edit.component.css']
})
export class UsersAddEditComponent implements OnInit {

  user: User;
  userPackup: User;
  menusDropDown: any[];
  
  dropdownsLoading: boolean = false;
  isEdit: boolean = false;
  busySaving: boolean = false;
  rank: number;
  totalCount: number;
  permission: Permission;
  
  @ViewChild('form') form: NgForm;

  constructor(
    private permissionsService: PermissionsService,
    private componentService: UsersService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,
    private route:ActivatedRoute,
    private menusDropDownService:MenusDropDownService,
    private resetPasswordService: ResetPasswordService,
    private swalService: SwalService
  ) { }

  ngOnInit() { 
    this.permission = this.permissionsService.getPermission(PERMISSIONS.users);
    this.user = new User()
    this.getAllDropDowns();
    if(this.route.snapshot.params.id) {
      this.getById(this.route.snapshot.params.id);
    }
    else{
      this.reset()
    }
  }

  getAllDropDowns() {
    this.dropdownsLoading = true;
    this.menusDropDownService.getMenusById().subscribe(
      res => {
        this.menusDropDown = res;
        this.dropdownsLoading = false;
      },
      err => {
        this.dropdownsLoading = false;
      }
    )
  }
  getById(id: string) {
    if(!id)
      return;
      this.spinner.show();
      this.componentService.get(id).subscribe(
        this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
      )
  }

  save() {
    this.busySaving = true;
    if(this.isEdit) {
      this.update()
    } else {
      this.create()
    }
  }
  cancel() {
    if(this.isEdit) {
      this.user =  Object.assign({}, this.userPackup);
    } else {
      this.reset();
    }
  }

  create() {
    this.componentService.create(this.user).subscribe(
      res => {
        this.reset();
        this.busySaving = false;
        this.notifier.notify('success', 'تمت الإضافة بنجاح');
      },
      err => {
        this.busySaving = false;
        let errorMessage = err.message || 'حدث خطأ اثناء الإضافة';
        this.notifier.notify('error', errorMessage);
      }
    )
  }
  update(){
    this.componentService.update(this.user.userId, this.user).subscribe(
      res => {
        this.setItemFromResponse(res);
        this.busySaving = false;
        this.notifier.notify('success', 'تم التعديل بنجاح');
      },
      err => {
        this.busySaving = false;
        let errorMessage = err.message || 'حدث خطأ اثناء التعديل';
        this.notifier.notify('error', errorMessage);
      }
    )
  }
  delete() {
    this.swalService.showRemoveConfirmation(this.user.userName).then(
      result => {
        if(result.value) {
          this.componentService.delete(this.user.userId).subscribe(
            res => {
              this.notifier.notify('success', 'تم الحذف  بنجاح');
              this.reset();
            },
            err => {
              let errorMessage = err.message || 'حدث خطأ اثناء الحذف';
              this.notifier.notify('error', errorMessage);
            }
          )
        }
      }
    );
  }
  getNext() {
    this.spinner.show();
    this.componentService.getNextRow(this.rank).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getPrevious() {
    this.spinner.show();
    this.componentService.getPreviousRow(this.rank).subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getFirst() {
    this.spinner.show();
    this.componentService.getFirstRow().subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  getLast() {
    this.spinner.show();
    this.componentService.getLastRow().subscribe(
      this.setItemFromResponse.bind(this), this.getItemErrorHandler.bind(this)
    )
  }
  setItemFromResponse(res: ResultWithRanking<User>) {
    this.user = res.result;
    this.rank = res.rank;
    this.totalCount = res.totalCount;
    this.userPackup =  Object.assign({}, this.user);
    this.isEdit=true;
    this.spinner.hide();
  }
  getItemErrorHandler(err) {
    let errorMessage = err.message || 'غير موجود';
    this.notifier.notify('error', errorMessage);
    this.spinner.hide();
  }

  reset() {
    this.form.reset();
    setTimeout(() => {
      this.user = new User();
    }, 50);
    this.isEdit = false;
    this.rank = null;
    this.totalCount = null;
  }
 
  resetKey() {
    this.spinner.show();
    this.resetPasswordService.resetPasswordService(this.user).subscribe(
      res => {
        this.spinner.hide();
        this.notifier.notify('success', 'تم مسح كلمة المرور بنجاح');

      },
      err => {
        this.spinner.hide();
        let errorMessage = err.message || 'حدث خطأ اثناء مسح كلمة المرور';
        this.notifier.notify('error', errorMessage);
      }
    )
  }
  selectOnlyMenu(menu: Menu) {
    this.user.onlyMenuId = menu.menuId;
  }

  
}
