import { Component, OnInit } from '@angular/core';
import { FilterParams, Config, MngrOrderWithNames, Branch } from 'src/app/shared/models';
import { MngrOrdersService, BranchesService } from 'src/app/shared/services';

@Component({
  selector: 'app-mngr-orders-list',
  templateUrl: './mngr-orders-list.component.html'
})
export class MngrOrdersListComponent implements OnInit {

  mngrOrders: MngrOrderWithNames[];
  branches:Branch[];
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;

  configs:Config[]=[
    {
      key: 'serial',
      label: ' الرقم ',
      visible: true
    },
    {
      key: 'date',
      label: 'التاريخ',
      visible: true,
      date: true
    },
    {
      key: 'branchId',
      label: 'القسم ',
      visible: true
    },
    {
      key: 'notes',
      label: ' ملاحظات  ',
      visible: false
    },
  ];
  constructor(
    private mngrOrderservice: MngrOrdersService,
    private branchService:BranchesService,
  
    ) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.getAllMngrOrders();
    this.getAllBranches();
  }
  getAllBranches(){
    this.branchService.getAll().subscribe(
      res=>{
        this.configs[2].select={
          list:res,
          displayTextKey:'branchName',
          valueKey:'branchId'
        }
      }
    );

  }
  getAllMngrOrders(){
    this.busyLoading = true;
    this.mngrOrderservice.getAll(this.filterParams).subscribe(
      res => {
        this.mngrOrders = res.result;
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
    this.getAllMngrOrders();
  }
  search(queryString) {
    this.filterParams.pageNumber = 1;
    this.filterParams.searchValue = queryString;
    this.getAllMngrOrders();
  }
  sort(sortParams) {
    this.filterParams.pageNumber = 1;
    this.filterParams.sortField = sortParams.sortColumn;
    this.filterParams.sortDirection = sortParams.sortDirection;
    this.getAllMngrOrders();
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.getAllMngrOrders();
  }
}

