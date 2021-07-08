import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appMessage]',
})
export class MessageDirective implements OnInit {
  @Input() appMessage: boolean = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    if (!this.appMessage) {
      return;
    }

    const { firstChild } = this.el.nativeElement;

    firstChild.className = `${firstChild.className} sender`;
  }
}
