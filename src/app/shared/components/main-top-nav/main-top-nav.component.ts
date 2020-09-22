import { Component, OnInit } from '@angular/core';

import { PagesMenu } from '../../../pages/pages-menu';
import { PermissionsService, SharedSettingsService } from 'src/app/shared/services';

@Component({
  selector: 'app-main-top-nav',
  templateUrl: './main-top-nav.component.html',
  styleUrls: ['./main-top-nav.component.css']
})
export class MainTopNavComponent implements OnInit {

  menuItems: PagesMenu[];
  settingsObj;

  constructor(
    private permissionsService: PermissionsService,
    private settings: SharedSettingsService
    ) { }

  getPermission(key) {
    if(!key)
      return false;
    return this.permissionsService.getPermission(key).open;
  }

  haveChildren(menuItem: PagesMenu) {
    let children = menuItem.data.children;
    if(children) {
      for(let i = 0; i < children.length; i++) {
        if(this.getPermission(children[i].data.permissionName))
          return true;
        else if (children[i].data.children) {
          return this.haveChildren(children[i])
        }
      }
    }
    return false;
  }

  hideNav() {
    document.getElementsByClassName('menu-toggle-btn')[0].classList.add("collapsed");
    document.getElementById("nav-list-collapse").classList.remove('show');
  }

  ngOnInit() {
    this.menuItems = PagesMenu[0].data.children;
    this.settings.getSettings().subscribe(data => {
      this.settingsObj = data;
    });
  }

  log(id) {
    console.log(id)
    console.log(this.getPermission(id));
  }

}
