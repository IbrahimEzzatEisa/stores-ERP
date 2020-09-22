import { Component, OnInit } from '@angular/core';
import { UsersService, AuthenticationService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  busySaving: boolean = false;
  model: any = {};

  constructor(private userService: UsersService,
              private notifier: NotifierService,
              private authService: AuthenticationService) { }

  ngOnInit() {
  }

  changeUserPassword() {
    
    if(this.model.userOldPass !== this.model.userOldPassTwo) {
      this.notifier.notify('error', 'كلمة المرور القديمة غير متطابقة');
      return;
    }
    if(this.model.userOldPassTwo === this.model.userNewPass) {
      this.notifier.notify('error', 'كلمة المرور الجديدة لا يمكن أن تكون مطابقة للقديمة');
      return;
    }
    this.busySaving = true;
    this.userService.changePassword({oldPassword: this.model.userOldPassTwo, newPassword: this.model.userNewPass})
    .subscribe((data) => {
      this.busySaving = false;
      this.notifier.notify('success', 'تم تغيير كلمة المرور بنجاح');
      this.authService.logout();
    }, (error) => {
      console.log(error);
      const errMsg = error.message || 'حدث خطأ أثناء تغيير كلمة المرور';
      this.notifier.notify('error', errMsg);
      this.busySaving = false;
    })
  }

}
