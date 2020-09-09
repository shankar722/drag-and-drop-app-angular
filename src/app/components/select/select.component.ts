import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @ViewChild('selectWrap') selectWrap: ElementRef;

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
    const elStyle = this.selectWrap.nativeElement.style;
    const parentStyle = this.selectWrap.nativeElement.parentElement.parentElement.style;
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
