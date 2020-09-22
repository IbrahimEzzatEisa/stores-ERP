import { Directive, EventEmitter, HostListener, ViewContainerRef, TemplateRef } from '@angular/core';

@Directive({
    selector: '[dropdown-list-input]'
})
export class DropdownListInputDirective {

    focus: boolean = false;
    $onFocus = new EventEmitter<boolean>();

    @HostListener("focus")
    onFocus() {
      this.focus = true;
      this.$onFocus.emit(this.focus);
    }
  
    @HostListener("blur")
    onBlur() {
      this.focus = false;
    }
    
}