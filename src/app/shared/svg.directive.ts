import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appSvg]'
})
export class SvgDirective implements OnInit {

  @Input() content: string;

  el: ElementRef;

  constructor(el: ElementRef) { this.el = el; }

  ngOnInit(): void {
    this.el.nativeElement.innerHTML =  this.content;
  }
}
