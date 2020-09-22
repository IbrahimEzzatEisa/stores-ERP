import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ItemGroupsService } from 'src/app/shared/services';
import { ItemGroup } from 'src/app/shared/models';

@Component({
  selector: 'app-add-all-items-modal',
  templateUrl: './add-all-items-modal.component.html'
})
export class AddAllItemsModalComponent implements OnInit {

  itemGroups: ItemGroup[];
  selectedItemGroup = new ItemGroup();
  busyLoadingDropdown: boolean = false;
  oneGroupChecked: boolean = false;

  constructor(
    private modal: NgbActiveModal,
    private itemGroupsService: ItemGroupsService
  ) { }

  ngOnInit() {
    this.getItemGroupsDropdown();
  }

  getItemGroupsDropdown() {
    this.busyLoadingDropdown = true;
    this.itemGroupsService.getAll().subscribe(
      res => {
        this.itemGroups = res;
        this.busyLoadingDropdown = false;
      },
      err => {
        this.busyLoadingDropdown = false;
      }
    )
  }
  selectItemGroup(itemGroup: ItemGroup) {
    this.selectedItemGroup = itemGroup
  }

  close() {
    this.modal.close(this.selectedItemGroup);
  }
  dismiss() {
    this.modal.dismiss();
  }

}
