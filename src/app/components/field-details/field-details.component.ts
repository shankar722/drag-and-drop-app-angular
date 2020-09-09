import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-field-details',
  templateUrl: './field-details.component.html',
  styleUrls: ['./field-details.component.scss']
})
export class FieldDetailsComponent implements OnInit {

  fieldDetails: FormGroup = new FormGroup({
    width: new FormControl(''),
    height: new FormControl(''),
    radio: new FormControl('absolute'),
    placeholder: new FormControl(''),
    name: new FormControl(''),
    options: new FormControl('')
  })

  constructor(
    public dialogRef: MatDialogRef<FieldDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.setExtraFormControl();
    this.fieldDetails.get('width').setValidators([Validators.required, Validators.min(200), Validators.max(this.data.maxWidth)]);
    this.fieldDetails.get('height').setValidators([Validators.required, Validators.min(50), Validators.max(this.data.maxHeight)]);
    console.log('field details', this.fieldDetails)
  }

  setExtraFormControl(){
    switch(this.data.name){
      case "input":
        this.fieldDetails.get('placeholder').setValidators([Validators.required]);
        break;

      case "button":
        this.fieldDetails.get('name').setValidators([Validators.required]);
        break;

      case "select":
        this.fieldDetails.get('options').setValidators([Validators.required]);
        break;  
    }
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if(this.fieldDetails.valid) {
      this.dialogRef.close(this.fieldDetails.value);
    } 
    else {
      this.fieldDetails.get('width').markAsTouched({ onlySelf: true });
      this.fieldDetails.get('height').markAsTouched({ onlySelf: true });
      switch(this.data) {
        case "input":
          this.fieldDetails.get('placeholder').markAsTouched({ onlySelf: true });
          break;

        case "button":
          this.fieldDetails.get('name').markAsTouched({ onlySelf: true });
          break;

        case "select":
          this.fieldDetails.get('options').markAsTouched({ onlySelf: true });
          break;
      }
    }
  }
}
