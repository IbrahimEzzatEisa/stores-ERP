import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {

  currentUserName: string

  constructor(
    private authService: AuthenticationService
  ) { }

  logout() {
    this.authService.logout();
  }

  ngOnInit() { 
    this.currentUserName = this.authService.getLoggedUserName();
  }

}
