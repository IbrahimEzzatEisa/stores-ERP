import { Injectable } from '@angular/core';

import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class SwalService {

    public showRemoveConfirmation(elementName?): Promise<SweetAlertResult> {
        elementName? elementName = `"${elementName}"` : elementName = "";
        return new Promise((resolve, reject)=>{
            Swal({
                title: 'هل انت متأكد؟',
                text: `حذف العنصر ${elementName}!`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: "swal-confirm",
                cancelButtonClass: "swal-cancel",
                confirmButtonText: 'نعم, احذف!',
                cancelButtonText:  'إلغاء'
              }).then((result) => {
                resolve(result)
              });
        })
    }
    public showConfirmation(params: {
        title?: string, 
        message: string
    }): Promise<SweetAlertResult> {
        params.title = params.title || 'هل انت متأكد؟';
        return new Promise((resolve, reject)=>{
            Swal({
                title: params.title,
                text: params.message,
                type: 'warning',
                showCancelButton: true,
                confirmButtonClass: "swal-confirm",
                cancelButtonClass: "swal-cancel",
                confirmButtonText: 'نعم!',
                cancelButtonText:  'إلغاء'
              }).then((result) => {
                resolve(result)
              });
        })
    }
    public showError(title: string | null, message: string | null) {
        Swal({
            title: title,
            text: message,
            type: 'error'
        })
    }

}