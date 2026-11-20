import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import tippy from 'tippy.js';

@Directive({
  selector: '[Tooltip]'
})
export class TooltipDirective implements OnInit {

  @Input() message: string = '';

    constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    tippy(this.el.nativeElement, {
      content: this.message
    });
  }
}
