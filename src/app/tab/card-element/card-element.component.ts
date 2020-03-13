import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Park } from 'src/models/carpark.model';

@Component({
  selector: 'app-card-element',
  templateUrl: './card-element.component.html',
  styleUrls: ['./card-element.component.scss'],
})
export class CardElementComponent implements OnInit, OnDestroy {

  @Input() lot:Park;
  @Input() uid: string;
  @Output() carUnbooked = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }
  unbookCarpark(key:string){
    this.carUnbooked.emit(key);
  }
  ngOnDestroy():void{
    this.carUnbooked.complete();
  }

}
