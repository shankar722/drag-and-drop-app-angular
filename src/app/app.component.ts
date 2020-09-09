import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { FieldDetailsComponent } from './components/field-details/field-details.component';
import { ELEMENT } from './interfaces/element.interface'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  elements: ELEMENT[] = [
    { "type": 'textarea' },
    { "type": 'input' },
    { "type": 'button' },
    { "type": 'select' }
  ];

  dragables: ELEMENT[] = [
    {
      "id": 1,
      "width": "",
      "height": "",
      "radio": "absolute",
      "name": "Button 1",
      "type": "textarea",
      "xAxis": 100,
      "yAxis": 40
    }
  ]

  isSideBarElementPicked: boolean= false;
  @ViewChild('dragContainer') dragContainer: ElementRef;

  constructor(
    private dialog: MatDialog,
    private renderer: Renderer2,
    private elRef: ElementRef) {
    }

  ngOnInit(): void {
    let mainData = localStorage.getItem('data');
      console.log('Main Data', mainData)

      if(mainData) {
        this.dragables = JSON.parse(mainData);
        console.log('Dragables loaded', this.dragables)
      }
  }

  ngAfterViewInit(): void {
    // this.setOffsetProps();
  }

  elementsDrop(event) {
    let itemName: string = event.item.element.nativeElement.textContent.trim();
    const outerContDimensions = this.dragContainer.nativeElement.getBoundingClientRect();

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data, 
        event.previousIndex, 
        event.currentIndex
      );
      console.log('not Moved');
    } 
    else {

      const dialogRef = this.dialog.open(FieldDetailsComponent, {
        width: '500px',
        data: {
          "name": itemName,
          "maxWidth": outerContDimensions.width,
          "maxHeight": outerContDimensions.height,
        },
        panelClass: 'field-detials-container'
      });
  
      dialogRef.afterClosed().subscribe( (result) => {
        console.log('Draggable', this.dragables);
        if(result){
          transferArrayItem(
            event.previousContainer.data, 
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );

          const currNode = this.dragables[event.currentIndex];
          currNode["id"] = this.dragables.length;
          currNode["width"] = result.width;
          currNode["height"] = result.height;
          currNode["radio"] = result.radio;
          currNode["xAxis"] = 0;
          currNode["yAxis"] = 0;
          switch(itemName) {
            case "input":
              currNode["placeholder"] = result.placeholder;
              break;
    
            case "button":
              currNode["name"] = result.name;
              break;
    
            case "select":
              currNode["options"] = result.options.split(',');
              break;
          }
          console.log('', this.dragables)
          
          for(let i=0; i<this.dragables.length; i++){
            const currEl = this.dragables[i];
            const xAxisTopLeftLimit = -14;
            const xAxisRightLimit = outerContDimensions.width;
            const yAxisBottomLimit = outerContDimensions.height;
            const xAxisLeftLimitBroken = this.dragables[i].xAxis < xAxisTopLeftLimit;
            const xAxisRightLimitBroken = (this.dragables[i].xAxis - parseFloat(this.dragables[i].width)) > xAxisRightLimit;
            const yAxisTopLimitBroken = this.dragables[i].yAxis < xAxisTopLeftLimit;
            const yAxisBottomLimitBroken = (this.dragables[i].yAxis - parseFloat(this.dragables[i].height)) > xAxisRightLimit;
            if(xAxisLeftLimitBroken || xAxisRightLimitBroken){
              xAxisLeftLimitBroken ? currEl.xAxis = xAxisTopLeftLimit : currEl.xAxis = xAxisRightLimit;
            } else if(yAxisTopLimitBroken || yAxisBottomLimitBroken) {
              yAxisTopLimitBroken ? currEl.yAxis = xAxisTopLeftLimit : currEl.yAxis = yAxisBottomLimit;
            }
          }
          console.log('', this.dragables)
          this.elements.splice(event.previousIndex, 0, {type: itemName});
        }
      });
    }
  }

  setCoordinates(x, y, index){
    this.dragables[index]["xAxis"] = x;
    this.dragables[index]["yAxis"] = y;
    console.log('Dragable data after setting coordinates', this.dragables);
  }

  dragStart(event) {
    console.log('Drag Start', event)
    this.isSideBarElementPicked = true;
  }

  dragReleased(event) {
    console.log('Drag Ended', event)
    this.isSideBarElementPicked = false;
  }

  save(){
    let stringJSON: any = JSON.stringify(this.dragables);
    let mainData = JSON.parse(stringJSON);
    for(let i=0; i<mainData.length; i++){
      mainData[i].xAxis = mainData[i].distanceX;
      mainData[i].yAxis = mainData[i].distanceY;
      delete mainData[i].distanceX;
      delete mainData[i].distanceY; 
      delete this.dragables[i].distanceX;
      delete this.dragables[i].distanceY;
    }
    localStorage.setItem('data', JSON.stringify(mainData));
  }

  removeElement(event) {
    const id = event;
    let currItem = this.dragables.filter(x => x.id === id);
    let currIndex = this.dragables.indexOf(currItem[0]);
    this.dragables.splice(currIndex, 1);
  }

  updateCoordinates(event) {
    const id = event.id;
    let currItem = this.dragables.filter(x => x.id === id);
    let currIndex = this.dragables.indexOf(currItem[0]);
    this.dragables[currIndex]["distanceX"] =  event.x;
    this.dragables[currIndex]["distanceY"] = event.y;
    console.log('dragables', this.dragables)
  }
}