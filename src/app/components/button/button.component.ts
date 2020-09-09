import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @ViewChild('buttonWrap') buttonWrap: ElementRef;

  @Input() data: any;

  @Output() updateCoordinates = new EventEmitter<any>();

  @Output() closeCall = new EventEmitter<any>();

  constructor() { 
    console.log('Data', this.data)
  }

  ngOnInit(): void {
    console.log('Data', this.data)
  }

  close() {
    this.closeCall.emit(this.data.id)
  }

  changeMousePointer(ev) {
    const elStyle = this.buttonWrap.nativeElement.style;
    const parentStyle = this.buttonWrap.nativeElement.parentElement.parentElement.style;
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

  dragEnded(event){
    console.log('Ended', event.source.getFreeDragPosition())
    let distance = {
      x: event.source.getFreeDragPosition().x,
      y: event.source.getFreeDragPosition().y,
      id: this.data.id
    }
    this.updateCoordinates.emit(distance);
  }

}
