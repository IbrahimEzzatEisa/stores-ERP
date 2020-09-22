import { Component, OnInit } from '@angular/core';
import { Supplier } from 'src/app/shared/models';
import { SuppliersService, ReportsService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-suppliers-report',
  templateUrl: './suppliers-report.component.html',
  styleUrls: ['./suppliers-report.component.css']
})
export class SuppliersReportComponent implements OnInit {
  
  suppliers:Supplier[];
  dropdownsLoading: boolean = false;
  busyPrinting: boolean = false;

  fromSupplierId: number;
  toSupplierId: number;

  constructor(
    private supplierService: SuppliersService,
    private notifier: NotifierService,
    private reportsService: ReportsService
  ) { }

  ngOnInit() {
    this.listAllSuppliers();
  }
  listAllSuppliers(){
    this.supplierService.getAll().subscribe(
      (res:any)=>{
        this.suppliers=res.result;
      }
    );
  }
  selectFromSupplierId(supplier) {
    this.fromSupplierId = supplier.supplierId;
  }
  selectToSupplierId(supplier) {
    this.toSupplierId = supplier.supplierId;
  }
  printReport() {
    if(this.fromSupplierId == undefined || this.toSupplierId == undefined) {
      this.notifier.notify('error', 'قم بإختيار الموردين أولاً');
      return;
    }
    this.busyPrinting = true;
    this.reportsService.getSuppliersReport(this.fromSupplierId, this.toSupplierId).subscribe((res) => {
      if(res.pdfUrl) {
        window.open(res.pdfUrl, "_blank", 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
        this.busyPrinting = false;
      }
    },
    err=>{
      this.busyPrinting = false;
      let errorMessage = err.message || 'خطأ فى الحصول على ملف الطباعة';
      this.notifier.notify('error', errorMessage);
      
    })
  }

}
