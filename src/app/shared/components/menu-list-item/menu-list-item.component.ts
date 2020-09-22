import { Component, OnInit, Input } from '@angular/core';

import { PermissionsService } from 'src/app/shared/services';
import { PagesMenu } from 'src/app/pages/pages-menu';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.css']
})
export class MenuListItemComponent implements OnInit {

  @Input() menuItem;

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
      return false;
    }
    return false;
  }

  hideNavMenus() {
    let menus = document.getElementsByClassName("menuItemComponent");
    if(menus) {
      for(let i = 0; i< menus.length; i++) {
        (menus[i]as HTMLElement).style.display = 'none';
      }
      setTimeout(()=>{
        for(let i = 0; i< menus.length; i++) {
          (menus[i]as HTMLElement).style.display = '';
        }
      }, 100);
    }
  }

  constructor(
    private permissionsService: PermissionsService
    ) { }

  ngOnInit() {
  }

}
