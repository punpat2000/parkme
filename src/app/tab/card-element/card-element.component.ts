import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Park } from 'src/models/carpark.model';

@Component({
  selector: 'app-card-element',
  templateUrl: './card-element.component.html',
  styleUrls: ['./card-element.component.scss'],
})
export class CardElementComponent implements OnInit {

  @Input() lot:Park;
  @Input() uid: string;
  @Output() carUnbooked = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }
  unbookCarpark(key:string){
    this.carUnbooked.emit(key);
  }

}
