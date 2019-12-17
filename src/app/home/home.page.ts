import { Component } from '@angular/core';
import {CarparkdbService} from '../carparkdb.service'


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private carparkdb: CarparkdbService
  ) {}
  
  ngOnInit() {
  }
  addCarpark(){
    this.carparkdb.addCarpark();
  }
}
