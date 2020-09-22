import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Permission } from '../../models';

@Component({
  selector: 'app-form-navigator',
  templateUrl: './form-navigator.component.html',
  styleUrls: ['./form-navigator.component.css']
})
export class FormNavigatorComponent {
  
  _isActive: boolean = false;
  @Input()
  set isActive(isActive) {
    this._isActive = isActive;
  }

  _rank: number;
  @Input()
  set rank(rank) {
    this._rank = rank;
  }

  _totalCount: number;
  @Input()
  set totalCount(totalCount) {
    this._totalCount = totalCount;
  } 

  @Input() permission: Permission;

  @Output() onReset = new EventEmitter();
  @Output() onNext = new EventEmitter();
  @Output() onPrevious = new EventEmitter();
  @Output() onFirst = new EventEmitter();
  @Output() onLast = new EventEmitter();
  @Output() onDelete = new EventEmitter();

  ngOnInit() {
    this.permission = this.permission || new Permission(true);
  }

  reset() {
    this.onReset.emit();
  }
  getNext() {
    this.onNext.emit();
  }
  getPrevious() {
    this.onPrevious.emit();
  }
  getFirst() {
    this.onFirst.emit();
  }
  getLast() {
    this.onLast.emit();
  }
  delete() {
    this.onDelete.emit();
  }


}
