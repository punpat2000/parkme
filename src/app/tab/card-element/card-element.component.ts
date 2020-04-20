import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Carpark } from 'src/app/core/models';

@Component({
  selector: 'app-card-element',
  templateUrl: './card-element.component.html',
  styleUrls: ['./card-element.component.scss'],
})
export class CardElementComponent implements OnInit, OnDestroy {

  @Input() lot: Carpark;
  @Input() uid: string;
  @Output() carUnbooked = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }
  unbookCarpark(key: string): void {
    this.carUnbooked.emit(key);
  }
  ngOnDestroy(): void {
    this.carUnbooked.complete();
  }

}
