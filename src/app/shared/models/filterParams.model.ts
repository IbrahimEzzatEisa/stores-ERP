export class FilterParams {
    constructor() {
      this.pageNumber = 1;
      this.pageSize = 100;
      this.searchValue = "null";
      this.sortField = "";
      this.sortDirection = "ASC"
    }
    pageNumber?: number;
    pageSize?: number;
    searchValue?: string;
    sortField?: string;
    sortDirection?: string;
  }