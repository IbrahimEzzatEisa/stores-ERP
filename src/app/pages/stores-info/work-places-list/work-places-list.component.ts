import { Component, OnInit } from '@angular/core';
import { WorkPlace, FilterParams } from 'src/app/shared/models';
import { WorkPlacesService } from 'src/app/shared/services';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-work-places-list',
  templateUrl: './work-places-list.component.html',
  styleUrls: ['./work-places-list.component.css']
})
export class WorkPlacesListComponent implements OnInit {
  workPlaces: WorkPlace[];
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
      key: 'workPlaceId',
      label: 'كود مساحة العمل',
      visible: true
    },
    {
      key: 'workPlaceName',
      label: 'اسم مساحة العمل',
      visible: true
    },
    {
      key: 'phone1',
      label: 'الجوال 1',
      visible: false
    },
    {
      key: 'phone2',
      label: 'الجوال 2',
      visible: false
    },
    {
      key: 'fax',
      label: 'الفاكس',
      visible: false
    },{
      key: 'address',
      label: 'العنوان',
      visible: false
    }
  ];
  busyPrinting: boolean = false;
  constructor(
    private workPlaceService: WorkPlacesService
    ,private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.getWorkPlaces();
  }

  getWorkPlaces() {
    this.busyLoading = true;
    this.workPlaceService.getAll(this.filterParams).subscribe(
      res => {
        this.workPlaces = res.result;
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
    this.getWorkPlaces();
  }
  search(queryString) {
    this.filterParams.pageNumber = 1;
    this.filterParams.searchValue = queryString;
    this.getWorkPlaces();
  }
  sort(sortField, sortDirection) {
    // TODO
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.getWorkPlaces();
  }
  print(){
    this.busyPrinting = true;
     this.workPlaceService.printReport().subscribe((res) => {
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
