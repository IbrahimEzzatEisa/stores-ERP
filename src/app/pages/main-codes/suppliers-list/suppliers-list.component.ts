import { Component, OnInit } from '@angular/core';

import { SuppliersService } from 'src/app/shared/services/api/suppliers.service';
import { Supplier } from 'src/app/shared/models';
import { FilterParams } from 'src/app/shared/models/filterParams.model';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-suppliers-list',
  templateUrl: './suppliers-list.component.html',
  styleUrls: ['./suppliers-list.component.css']
})
export class SuppliersListComponent implements OnInit {

  suppliers: Supplier[];
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;
  configs: {
    key: string,
    label: string,
    visible: boolean;
  }[] = [
    {
      key: 'supplierId',
      label: 'كود المورد',
      visible: true
    },
    {
      key: 'supplierName',
      label: 'اسم المورد',
      visible: true
    },
    {
      key: 'phone1',
      label: 'تليفون 1',
      visible: false
    },
    {
      key: 'phone2',
      label: 'تليفون 2',
      visible: false
    },
    {
      key: 'address',
      label: 'الفاكس',
      visible: false
    },
    {
      key: 'fax',
      label: 'العنوان',
      visible: false
    }
  ];
  busyPrinting: boolean =false;

  
  constructor(
    private suppliersService: SuppliersService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.getSuppliers();
  }

  getSuppliers() {
    this.busyLoading = true;
    this.suppliersService.getAll(this.filterParams).subscribe(
      res => {
        this.suppliers = res.result;
        this.filterParams.pageNumber = res.pagination.currentPage;
        this.filterParams.pageSize = res.pagination.itemsPerPage;
        this.totalNumberOfPages = res.pagination.totalPages;
        this.totalNumberOfItems = res.pagination.totalItems;
        this.busyLoading = false;
      },
      err => {
        this.busyLoading = false;
      }
    )
  }

  changePageSize(pageSize) {
    this.filterParams.pageNumber = 1;
    this.filterParams.pageSize = pageSize;
    this.getSuppliers();
  }
  search(queryString) {
    this.filterParams.pageNumber = 1;
    this.filterParams.searchValue = queryString;
    this.getSuppliers();
  }
  sort(sortParams) {
    this.filterParams.pageNumber = 1;
    this.filterParams.sortField = sortParams.sortColumn;
    this.filterParams.sortDirection = sortParams.sortDirection;
    this.getSuppliers();
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.getSuppliers();
  }

  print(){
   this.busyPrinting = true;
    this.suppliersService.printReport().subscribe((res) => {
      if(res.pdfUrl) {
        window.open(res.pdfUrl, "_blank", 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
      }
      this.busyPrinting = false;
    },
    err=>{
      this.notifier.notify('error', err.message || 'خطأ فى الحصول على ملف الطباعة');
      this.busyPrinting = false;
    })
  }
}
