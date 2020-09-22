import { Component, OnInit } from '@angular/core';
import { User, FilterParams } from 'src/app/shared/models';
import { UsersService } from 'src/app/shared/services';
// import { FilterParams } from 'src/app/shared/models/filterParams.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users: User[];
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
      key: 'userId',
      label: 'كود المستخدم',
      visible: true
    },
    {
      key: 'userName',
      label: 'اسم المستخدم',
      visible: true
    },
    {
      key: 'onlyMenuId',
      label: 'شاشة واحدة فقط',
      visible: false
    },
    {
      key: 'ignoreAutoSerial',
      label: 'غير مقيد بمسلسل',
      visible: false
    },
    {
      key: 'notActive',
      label: 'غير مفعل',
      visible: false
    }
  ];
  constructor(
    private usersService: UsersService
  ) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.getUsers();
  }

  getUsers() {
    this.busyLoading = true;
    this.usersService.getAll(this.filterParams).subscribe(
      res => {
        this.users = res.result;
        console.log(this.users)
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
    this.getUsers();
  }
  search(queryString) {
    this.filterParams.pageNumber = 1;
    this.filterParams.searchValue = queryString;
    this.getUsers();
  }
  sort(sortParams) {
    this.filterParams.pageNumber = 1;
    this.filterParams.sortField = sortParams.sortColumn;
    this.filterParams.sortDirection = sortParams.sortDirection;
    this.getUsers();
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.getUsers();
  }
}
