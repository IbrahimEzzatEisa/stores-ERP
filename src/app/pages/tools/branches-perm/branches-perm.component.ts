import { Component, OnInit } from '@angular/core';

import { Branch } from 'src/app/shared/models';
import { BranchesService, UsersService } from 'src/app/shared/services';

@Component({
  selector: 'app-branches-perm',
  templateUrl: './branches-perm.component.html',
  styleUrls: ['./branches-perm.component.css']
})
export class BranchesPermComponent implements OnInit {
  branches:Branch[];
  userName: string;
  userId: any;
  userIdKeyUp:number;

  constructor(
    private branchService:BranchesService,
    private userService:UsersService,
  ) { }

  ngOnInit() {
    this.listAllBranches();
  }
  onKey(event: any) {
    this.userIdKeyUp = event.target.value;
    this.getUserName();
    if (event.key === "Enter") {
      this.userId = event.target.value;
    }
  }
  listAllBranches(){
    this.branchService.getAll().subscribe(
      (res:Branch[])=>{
        this.branches=res;
        console.log("branches=",res);
      }
    );
  }
  getUserName(){
    this.userService.getName(this.userIdKeyUp).subscribe(
      res=>{
        this.userName=res.userName;
        console.log("user name = ",res.userName);
      }
    );

  }
  addNewBranch(){

  }

}
