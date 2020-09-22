import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class DeleteConfirmationModalComponent implements OnInit {

  constructor(private activeModal: NgbActiveModal) { }

  @Input() resolve;
  item: any;
  itemName: string;

  ngOnInit() {
    var _self = this;
    _self.resolve = _self.resolve || {};
    _self.item = _self.resolve.item || {};
    _self.itemName = _self.resolve.itemName;
    console.log("_self.item", _self.item);
  }

  save () {
    var _self = this;
    _self.activeModal.close(_self.item);
  }
  close () {
    var _self = this;
    _self.activeModal.dismiss(false);
  }

}
