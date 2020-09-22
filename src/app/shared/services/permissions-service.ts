import { Injectable } from '@angular/core';

import { Permission } from 'src/app/shared/models';
import { UsersPermsService } from 'src/app/shared/services/api';
import { permissionsTypes } from '../enums';

declare var require;
var jwtDecode = require("jwt-decode");

export enum PERMISSIONS {
    branches = 105,
    suppliers = 120,
    storeTypes = 130,
    storeSections = 135,
    units = 145,
    itemTypes = 150,
    itemStates = 155,
    specifications = 160,
    recommendations = 180,
    stockTakingTypes = 185,
    employees = 203,
    storeKeepers = 205,
    relateUserToEmployee = 207,
    stores = 210,
    workPlaces = 220,
    itemGroups = 305,
    items = 315,
    openingBalance = 405,
    mngrOrders = 407,
    tempReceiveNotification = 410,
    receiveNote = 415,
    receiveRecord = 420,
    // محضر إستلام 2 = 422,
    itemOutOrder = 425,
    transferCustody = 430,
    // مستند إرجاع = 435,
    stockTakingTrx = 505,
    damagedSettlement = 515,
    custodyTrx = 610,
    custodyTransfer = 620,
    returnDocument = 630,
    itemsReports = 701,
    measureUnitsReports = 705,
    itemsDataReports = 710,
    itemCardReports = 720,
    returnItemCardReports = 722,
    returnItemsDataReport = 724,
    storesReports = 730,
    storeItemsBalanceReport = 732,
    storeKeepersReport = 735,
    storeReport = 740,
    workPlacesReport = 745,
    movementsReports = 760,
    suppliersReport = 765,
    trxTypesReport = 770,
    empCustodyReport = 780,
    receiveNoteReport = 783,
    receiveRecordReport = 785,
    itemOutOrderReport = 787,
    tempReceiveNotificationReport = 789,
    transferCustodyReport = 790,
    returnDocumentReport = 792,
    users = 905,
    usersPerm = 910,
    branchesPerm = 915,
    // إعدادات الحركات = 922,
    settings = 925,
    // صورة من الشاشة = 1010,
    // Word = 1020,
    // Excel = 1030,
    // الآلة الحاسبة = 1040,
    // دفتر تليفونات = 1050,
    // مجموعات الإتصال = 1051,
    // جهات الإتصال = 1052,
    // البحــث = 1053,
    // تنبيهات = 1060,
    // محادثة = 1070,
    noPermission = 999
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  permissions: Permission[];

  constructor(
    private userPerms: UsersPermsService,
    ) { }

  setPermissions(permissions) {
    this.permissions = permissions;
  }

  refreshPermissions() {
    let userId = this.getStoredUserId();
    return this.userPerms.getMenu(userId).subscribe(
      permissions => {
        this.setPermissions(permissions);
      }
    )
  }

  getPermission(menuId): Permission {
    if(menuId === PERMISSIONS.noPermission) return new Permission(true);
    if(!this.permissions) return new Permission();
    let permission = this.permissions.find(premission => premission.menuId == menuId);
    if(permission)
      return permission;
    else 
      return new Permission();
  }
  getPermissionOfType(menuId: number, permissionType: permissionsTypes) {
    const permission = this.getPermission(menuId);
    switch(permissionType) {
      case permissionsTypes.open:
        return permission.open;
      case permissionsTypes.read:
        return permission.read;
      case permissionsTypes.insert:
        return permission.insert;
      case permissionsTypes.update:
        return permission.update;
      case permissionsTypes.delete:
        return permission.delete;
    }
  }

  loadPermissions(userId) {
    return this.userPerms.getMenu(userId);
  }

  private getStoredUserId() {
    if(!localStorage.getItem('token'))
        return null;
    try {
        let token = localStorage.getItem('token');
        let decodedToken = jwtDecode(token);
        return decodedToken.nameid;
    } catch (err) {
        return null;
    }
}


}
