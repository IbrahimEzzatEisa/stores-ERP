import { Component, OnInit, Input } from '@angular/core';
import { Permission } from '../../models';

@Component({
  selector: 'app-permissions-string',
  templateUrl: './permissions-string.component.html',
  styleUrls: ['./permissions-string.component.css']
})
export class PermissionsStringComponent implements OnInit {

  _permissions;
  @Input()
  set permission(list: Permission) {
    this._permissions = list
  }

  constructor() { }

  ngOnInit() {
  }

}
