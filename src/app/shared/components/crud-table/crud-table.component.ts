import { Component, OnInit, Input } from '@angular/core';

import { SwalService } from 'src/app/shared/services';
import { ObjectStatus } from 'src/app/shared/enums';
import { TableConfig } from 'src/app/shared/models';

@Component({
  selector: 'app-crud-table',
  templateUrl: './crud-table.component.html',
  styleUrls: ['./crud-table.component.css']
})
export class CrudTableComponent implements OnInit {
  itemNewRow:any;
  
  isDeletedStatus = ObjectStatus.deleted;

  _config: TableConfig[];
  @Input()
  set config(config: TableConfig[]) {
    this._config = config || [];
  }

  _listItems: any[];
  @Input()
  set listItems(list: any) {
    list = list || [];
    list.forEach(item => {
      item['status'] = ObjectStatus.changed;
    });
    this._listItems = list;
  }

  @Input() itemNameKey;
  @Input() disableEdit: boolean;


  constructor(private swalService: SwalService) { }

  //Actions
  create(model: any) {
    model["status"] = ObjectStatus.created;
    this._listItems.push(model);
    this.itemNewRow={};
  }
  delete(model, index: number) {
    this.swalService.showRemoveConfirmation().then(
      res => {
        if(res.value) {
          if(model["status"] == ObjectStatus.created)
          this._listItems.splice(index, 1);
          else 
            model["status"] = ObjectStatus.deleted;
        }
      }
    )
  }
  ngOnInit() {
    this.itemNewRow={};
  } 

}
