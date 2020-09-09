import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  @ViewChild('inputWrap') inputWrap: ElementRef;

  @Input() data: any;

  @Output() updateCoordinates = new EventEmitter<any>();

  @Output() closeCall = new EventEmitter<any>();

  freeDragPosition: { x?: number, y?: number } = null;

  constructor() { }

  ngOnInit(): void {}

  close() {
    this.closeCall.emit(this.data.id)
  }

  dragEnded(event){
    console.log('Ended', event.source.getFreeDragPosition())
    let distance = {
      x: event.source.getFreeDragPosition().x,
      y: event.source.getFreeDragPosition().y,
      id: this.data.id
    }
    this.updateCoordinates.emit(distance);
  }

  changeMousePointer(ev) {
    const elStyle = this.inputWrap.nativeElement.style;
    const parentStyle = this.inputWrap.nativeElement.parentElement.parentElement.style;
    if(ev === 'mousedown') { 
      elStyle.cursor = 'grabbing';
      elStyle.zIndex = 999;
      parentStyle.cursor = 'grabbing';
    } else {
      elStyle.cursor = 'grab';
      elStyle.zIndex = this.data.id;
      parentStyle.cursor = 'default';
    }
  }

}
