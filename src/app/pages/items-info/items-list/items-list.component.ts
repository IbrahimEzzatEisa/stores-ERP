import { Component, OnInit } from '@angular/core';
import { forkJoin, config } from 'rxjs';

import { 
  Item, 
  FilterParams 
} from 'src/app/shared/models';
import { 
  ItemsService, 
  ItemGroupsService, 
  ItemTypesService, 
  StoresService, 
  StoreSectionsService 
} from 'src/app/shared/services/api';

enum configIndexes {
  itemGroup = 1,
  itemType = 3,
  store = 8,
  storeSection = 9
}

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.css']
})
export class ItemsListComponent implements OnInit {

  items: Item[];
  filterParams = new FilterParams();
  totalNumberOfPages: number;
  totalNumberOfItems: number;
  busyLoading: boolean = false;

  configs: {
    key: string,
    label: string,
    visible: boolean;
    select?: {
      valueKey: string,
      displayTextKey: string,
      list: any[]
    },
    check?: boolean
  }[] = [
    { // 0
      key: 'itemId',
      label: 'كود الصنف',
      visible: true
    },
    { // 1
      key: 'itemGroupId',
      label: 'كود المجموعة',
      visible: true,
    },
    { // 2
      key: 'itemName',
      label: 'اسم الصنف',
      visible: true
    },
    { // 3
      key: 'itemTypeId',
      label: 'نوع الصنف',
      visible: false
    },
    { // 4
      key: 'maxStoreLevel',
      label: 'الحد الأعلى للمخزون',
      visible: false
    },
    { // 5
      key: 'minStoreLevel',
      label: 'الحد الأدنى للمخزون',
      visible: false
    },
    { // 6
      key: 'reorderLevel',
      label: 'حد الطلب للمخزون',
      visible: false
    },
    { // 7
      key: 'price',
      label: 'السعر',
      visible: false
    },
    { // 8
      key: 'storeId',
      label: 'المخزن الافتراضي',
      visible: false
    },
    { // 9
      key: 'storeSectionId',
      label: 'مكان التخزين الافتراضي',
      visible: false
    },
    { // 10
      key: 'itemUnits',
      label: 'الوحدات',
      visible: false
    }
  ];
  constructor(
    private itemsService: ItemsService,
    private itemGroupsService: ItemGroupsService,
    private ItemTypesService: ItemTypesService,
    private storesService: StoresService,
    private storeSectionsService: StoreSectionsService
  ) { }

  ngOnInit() {
    this.filterParams.pageSize = 10;
    this.getDropDowns();
    this.getItems();
  }

  getItems(){
    this.busyLoading = true;
    this.itemsService.getAll(this.filterParams).subscribe(
      res => {
        this.items = res.result;
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
    this.getItems();
  }
  search(queryString) {
    this.filterParams.pageNumber = 1;
    this.filterParams.searchValue = queryString;
    this.getItems();
  }
  sort(sortParams) {
    this.filterParams.pageNumber = 1;
    this.filterParams.sortField = sortParams.sortColumn;
    this.filterParams.sortDirection = sortParams.sortDirection;
    this.getItems();
  }
  changePage(pageNumber) {
    this.filterParams.pageNumber = pageNumber;
    this.getItems();
  }

  getDropDowns() {
    forkJoin([
      this.itemGroupsService.getAll(),
      this.ItemTypesService.getAll(),
      this.storesService.getAll(),
      this.storeSectionsService.getAll()
    ]).subscribe(
      res => {
        this.configs[configIndexes.itemGroup].select = {
          valueKey: "itemGroupId",
          displayTextKey: "itemGroupName",
          list: res[0]
        }
        this.configs[configIndexes.itemType].select = {
          valueKey: "itemTypeId",
          displayTextKey: "itemTypeName",
          list: res[1]
        }
        this.configs[configIndexes.store].select = {
          valueKey: "storeId",
          displayTextKey: " storeName",
          list: res[2].result
        }
        this.configs[configIndexes.storeSection].select = {
          valueKey: "storeSectionId",
          displayTextKey: "storeSectionName",
          list: res[3]
        }
      }
    )
  }

}
