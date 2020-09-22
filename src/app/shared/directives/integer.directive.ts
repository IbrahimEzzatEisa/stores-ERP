import { Directive, Input, Output, EventEmitter, OnChanges } from "@angular/core";

@Directive({ 
    selector: '[integer]' 
})
export class IntegerDirective implements OnChanges {

    @Input() ngModel;
    @Output() ngModelChange = new EventEmitter();

    ngOnChanges(changes) {
        if(changes.ngModel && this.ngModel) {
            setTimeout(()=>{
                this.ngModelChange.emit((this.ngModel+'').replace(/[^0-9]+/g, ''));
            }, 1);
        }
    }

}