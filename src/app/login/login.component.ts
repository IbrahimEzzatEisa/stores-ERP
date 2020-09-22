import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../shared/services';
import { Router,ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userId;
  userName;
  userPassword;
  redirectUrl: string;
  redirectMessage:string;
  busyLoggingIn: boolean = false;
  isRememberMeChecked: boolean = false;

  //TODO
  valideUser;
  busy;
  firstRequestDone;
  
  @ViewChild('updatePasswordModal') updatePasswordModal;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private notifier: NotifierService,
  ) { }

  
  login() {
    this.busyLoggingIn = true;
    this.usersService.login({
      userId: this.userId,
      password: this.userPassword
    }).subscribe(
      res => {
        if(res.token) {
          if(this.isRememberMeChecked) {
            this.rememberMe();
          } else {
            this.forgetMe();
          }
          if(this.redirectUrl) {
            this.router.navigateByUrl(this.redirectUrl);
          } else {
            this.router.navigate(['/pages']);
          }
         
        }
        this.busyLoggingIn = false;
      },
      err => {
        this.notifier.notify('error', err.message );
        this.busyLoggingIn = false;
      }
    );
  }
  getUserName() {
    if(!this.userId)
      return;
    this.getPassword();
    this.busy = true;
    this.usersService.getName(this.userId).subscribe(
      res => {
        this.userName = res.userName;
        this.valideUser = true;
        this.busy = false;
        this.firstRequestDone = true;
        if(res.isNullPassword == "true") {
          let passwordInput = document.getElementById('passwordInput');
          if(passwordInput) {
            passwordInput.blur();
          }
          this.openChangePasswordModal(this.updatePasswordModal);
        }
      }, 
      err => {
        console.log("err", err);
        this.userName = 'غير موجود';
        this.valideUser = false;
        this.busy = false;
        this.firstRequestDone = true;
      }
    );
  }
  ngOnInit() {
    if(this.route.snapshot.queryParams) {
      this.redirectUrl = this.route.snapshot.queryParams.redirect || '';
      this.redirectMessage = this.route.snapshot.queryParams.redirectMessage || '';
    }
  }

  openChangePasswordModal(modal) {
    this.modalService.open(modal, { centered: true }).result.then((newPassword) => {
      this.usersService.updatePassword(this.userId, newPassword).subscribe(
        res => {
          this.notifier.notify('success', 'تم حفظ كلمة المرور بنجاح. قم بتسجيل الدخول');
        }, 
        err => {
          const errMessage = err.message || 'حدث خطأ اثناء تسجيل كلمة المرور!';
          this.notifier.notify('error', errMessage);
          this.openChangePasswordModal(modal);
        }
      );
    }, (reason) => {
      this.userId = null;
    });
  }
  getPassword() {
    const password = localStorage.getItem(this.userId);
    if(password) {
      this.userPassword = password;
      this.isRememberMeChecked = true;
    }
  }
  rememberMe() {
    localStorage.setItem(this.userId, this.userPassword)
  }
  forgetMe() {
    localStorage.removeItem(this.userId);
  }
}
