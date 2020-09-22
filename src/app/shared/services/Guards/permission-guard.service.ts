import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { PermissionsService } from '../permissions-service';
import { permissionsTypes } from '../../enums';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {

  constructor(
    private userPermissionsService: PermissionsService,
    private router: Router
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let permissionId = route.data["permissionId"] as number;
    let permissionType = route.data["permissionType"] as permissionsTypes || 0;


    let canOpenPage = this.userPermissionsService.getPermissionOfType(permissionId, permissionType);
    if (!canOpenPage) {
      switch (permissionType) {
        case permissionsTypes.open:
          this.router.navigate(['pages/page-not-found']);
          break;
        case permissionsTypes.insert:
          this.router.navigate([state.url+'/list']);
          break;
        case permissionsTypes.read:
          this.router.navigate(['pages/page-not-found']);
          break;
        case permissionsTypes.update:
          if(this.userPermissionsService.getPermissionOfType(permissionId, permissionsTypes.read)) {
            return true;
          } else {
            this.router.navigate(['pages/page-not-found']);
          }
          break;
      }
      return false;
    }
    return true;
  }
}
