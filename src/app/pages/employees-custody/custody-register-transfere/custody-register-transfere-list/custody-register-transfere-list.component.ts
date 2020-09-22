import { Component, OnInit } from '@angular/core';
import { CustodyTrxesService } from 'src/app/shared/services';
import { FilterParams, CustodyTrxWithNames, Config } from 'src/app/shared/models';
import { ActivatedRoute } from '@angular/router';
import { CustodyTypes } from 'src/app/shared/enums';

const CUSTODY_REGISTER_PAGE_PATH = "custody-register";
const CUSTODY_TRANSFERE_PAGE_PATH = "custody-transfer";

@Component({
  selector: 'app-custody-register-transfere-list',
  templateUrl: './custody-register-transfere-list.component.html'
})

export class CustodyRegisterTransfereListComponent implements OnInit {

  addButtonText: string;
  pageCustodyType: number;
  custodyTrxes: CustodyTrxWithNames[];
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;
  configs: Config[] = [
    {
      key: 'serial',
      label: 'رقم العهدة',
      visible: true
    },
    {
      key: 'date',
      label: 'التاريخ',
      visible: true,
      date: true
    },
    {
      key: 'empName',
      label: 'من موظف',
      visible: true
    },
    {
      key: 'toEmpName',
      label: 'إلى موظف',
      visible: true
    },
    {
      key: 'notes',
      label: 'الملاحظات',
      visible: false
    },
    {
      key: 'branchManagerName',
      label: 'رئيس الجهة',
      visible: false
    },
    {
      key: 'ownerName',
      label: 'صاحب الصلاحية',
      visible: false
    }
  ];

  constructor(private custodyTrxService: CustodyTrxesService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    if(this.route.snapshot.url[0].path === CUSTODY_REGISTER_PAGE_PATH) {
      this.pageCustodyType = CustodyTypes.register;
      this.addButtonText = "إضافة عهدة";
      const toEmpIndex = 3;
      this.configs.splice(toEmpIndex,1);
    } else if(this.route.snapshot.url[0].path === CUSTODY_TRANSFERE_PAGE_PATH) {
      this.pageCustodyType = CustodyTypes.transfere;
      this.addButtonText = "نقل عهدة";
    }


    this.filterParams.pageSize = 10;
    this.getCustodyTrxes();
  }

  getCustodyTrxes() {
    this.busyLoading = true;
    this.custodyTrxService.getAll(this.pageCustodyType, this.filterParams).subscribe(
      res => {
        console.log(res)
        this.custodyTrxes = res.result;
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
    this.getCustodyTrxes();
  }
  search(queryString) {
    this.filterParams.pageNumber = 1;
    this.filterParams.searchValue = queryString;
    this.getCustodyTrxes();
  }
  sort(sortParams) {
    this.filterParams.pageNumber = 1;
    this.filterParams.sortField = sortParams.sortColumn;
    this.filterParams.sortDirection = sortParams.sortDirection;
    this.getCustodyTrxes();
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.getCustodyTrxes();
  }


}
