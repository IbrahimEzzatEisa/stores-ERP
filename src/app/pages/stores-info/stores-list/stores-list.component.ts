import { Component, OnInit } from '@angular/core';

import { Store, Config, FilterParams } from '../../../shared/models';
import { StoresService } from '../../../shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-stores-list',
  templateUrl: './stores-list.component.html',
  styleUrls: ['./stores-list.component.css']
})
export class StoresListComponent implements OnInit {

  
  stores: Store[];
  busyLoading: boolean = false;
  busyPrinting: boolean = false;
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  
  configs:Config[]=[
    {
      key: 'storeId',
      label: 'كود المستودع',
      visible: true
    },
    {
      key: 'storeName',
      label: 'اسم المستودع ',
      visible: true
    },
    {
      key: 'storeTypeId',
      label: ' رقم تصنيف المستودع ',
      visible: true
    },
    {
      key: 'storeKeeperId',
      label: ' رمز أمين المستودع ',
      visible: false
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
      key: 'fax',
      label: 'فاكس',
      visible: true
    }, {
      key: 'address',
      label: 'العنوان',
      visible: false
    }


  ];
  
  constructor(
    private storeService:StoresService,
   private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.listAllStores();
  }

  listAllStores(){
    this.busyLoading =true;
    this.storeService.getAll(this.filterParams).subscribe(
      res => {
        this.stores = res.result;
        this.filterParams.pageNumber = res.pagination.currentPage;
        this.filterParams.pageSize = res.pagination.itemsPerPage;
        this.totalNumberOfPages = res.pagination.totalPages;
        this.totalNumberOfItems = res.pagination.totalItems;
        this.busyLoading = false;
        console.log("response of pagination",res.pagination);
      },
      err => {
        this.busyLoading = false;
      }

    );
  }

  
  changePageSize(pageSize) {
    this.filterParams.pageNumber = 1;
    this.filterParams.pageSize = pageSize;
    this.listAllStores();
  }
  search(queryString) {
    this.filterParams.pageNumber = 1;
    this.filterParams.searchValue = queryString;
    this.listAllStores();
  }
  
  sort(sortParams) {
    this.filterParams.pageNumber = 1;
    this.filterParams.sortField = sortParams.sortColumn;
    this.filterParams.sortDirection = sortParams.sortDirection;
    this.listAllStores();
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.listAllStores();
  }
  
  print(){
    this.busyPrinting = true;
     this.storeService.printReport().subscribe((res) => {
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
