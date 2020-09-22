import { Component, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { Permission } from 'src/app/shared/models';
import { UsersService, UsersPermsService, AuthenticationService, PermissionsService } from 'src/app/shared/services';

@Component({
  selector: 'app-users-perm',
  templateUrl: './users-perm.component.html',
  styleUrls: ['./users-perm.component.css']
})
export class UsersPermComponent implements OnInit {

  // ************** table checkboxes hover over sticky table head

  @ViewChild('tableHead') tableHead: ElementRef;
  @ViewChild('thTableRow') thTableRow: ElementRef;

  // @HostListener("window:scroll", [])
  // onWindowScroll() {
  //   if(this.isEdit === true) {
  //     const eleOffsetTop = this.tableHead.nativeElement.getBoundingClientRect().top;
  //     if(eleOffsetTop <= 0) {
  //       const thOffset = Math.abs(eleOffsetTop)
  //       this.renderer.setStyle(this.thTableRow.nativeElement, 'transform', `translateY(${thOffset}px)`);
  //       this.renderer.addClass(this.thTableRow.nativeElement, 'fixed-table-head');
  //     } else {
  //       this.renderer.setStyle(this.thTableRow.nativeElement, 'transform', `translateY(0px)`);
  //       this.renderer.removeClass(this.thTableRow.nativeElement, 'fixed-table-head');
  //     }
  //   }
  // }
  
  userId: string;  
  userName: string;
  userNameSubscription: Subscription;
  permissionsList: Permission[];
  isEdit: boolean = false;
  busyLoadingName: boolean = false;
  busySaving: boolean = false;
  searchText: string = '';

  constructor(
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,
    private userService: UsersService,
    private usersPermService: UsersPermsService,
    private authService: AuthenticationService,
    private permissionsService: PermissionsService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
  }

  getUserName() {
    if(this.userNameSubscription)
      this.userNameSubscription.unsubscribe();
    if(!this.userId)
      return this.userName = '';
    this.busyLoadingName = true;
    this.userNameSubscription = this.userService.getName(this.userId).subscribe(
      res => {
        this.busyLoadingName = false;
        this.userName = res.userName;
      },
      err => {
        this.busyLoadingName = false;
        this.userName = '';
      }
    );
  }
  getPermissions() {
    this.spinner.show();
    this.usersPermService.getUserPermissions(this.userId).subscribe(
      res => {
        this.spinner.hide();
        if(res.length === 0) {
          this.reset();
          this.notifier.notify('error', 'المستخدم غير موجود');
          return;
        }
        this.isEdit = true;
        this.permissionsList = res;
      },
      err => {
        this.reset();
        this.spinner.hide();
        const errMessage = err.message || 'حدث خطأ أثناء تحميل الصلاحيات';
        this.notifier.notify('error', errMessage);
      }
    )
  }

  save() {
    this.busySaving = true;
    this.usersPermService.update(this.userId, this.permissionsList).subscribe(
      res => {
        this.busySaving = false;
        if (this.userId == this.authService.getStoredUserId()) {
          this.permissionsService.refreshPermissions();

          // // 920 == permission page (this page) menu id
          // let permissionsPageRowUpdated = res.find(item => item.menuId == 920);
          // if (this.compareRowsPermission(this.permissionsPageRow, permissionsPageRowUpdated)) {
          //   console.log("****************equal****************");
          //   // window.location.reload();
          // }
          // else {
          //   console.log("****************Not equal****************");
          //   console.log("row before ", this.permissionsPageRow);
          //   console.log("row after update ", permissionsPageRowUpdated);
          //   window.location.reload();

          // }
        }
        
        this.getPermissions();
        this.notifier.notify('success', 'تم التعديل بنجاح');
      },
      err => {
        this.busySaving = false;
        const errMessage = err.message || 'حدث خطأ أثناء التعديل';
        this.notifier.notify('error', errMessage);
      }
    );

  }

  reset() {
    this.isEdit = false;
    this.userId = '';
    this.userName = '';
    this.permissionsList = [];
  }

  rowToggler = (function() {
    var keys = ['open', 'read', 'insert', 'update', 'delete', 'print'];
    function toggle(row) {
      if(isUnchecked(row)) {
        check(row);
      } else {
        uncheck(row);
      }
    }
    function check(row) {
      for(let i=0; i< keys.length; i++)
        row[keys[i]] = true;
    }
    function uncheck(row) {
      for(let i=0; i< keys.length; i++)
        row[keys[i]] = false;
    }
    function isUnchecked(row) {
      for(let i=0; i< keys.length; i++)
        if(!row[keys[i]])  
          return true;
      return false;
    }
    return {
      toggle: toggle,
      check: check
    };
  }());

  toggleRow(row) {
    this.rowToggler.toggle(row)
  }
  //////////************************************************************* */
  toggleCol(col){
    this.colToggler.toggle(col,this.permissionsList)
  }
  colToggler=(function(){

    function toggle(col,permissionsList) {
      if(isUnchecked(col,permissionsList)) {
        check(col,permissionsList);
      } else {
        uncheck(col,permissionsList);
      }
    }
    function check(col,permissionsList) {
      for(let i=0; i< permissionsList.length; i++)
        {
          permissionsList[i][col]= true;
        }
    }
    function uncheck(col,permissionsList) {
      for(let i=0; i< permissionsList.length; i++)
        {
          permissionsList[i][col]= false;
        }
    }

    function isUnchecked(col,permissionsList) {
      for(let i=0; i< permissionsList.length; i++)
        {
          if(!permissionsList[i][col])  
          {
              return true;
          }
        }
        
      return false;
    }
    return {
      toggle: toggle,
      check: check
    };

  }());
  //***************************************************************** */
  selectAll() {
    for(let i=0; i < this.permissionsList.length; i++) {
      this.rowToggler.check(this.permissionsList[i]);
    }
  }

}
