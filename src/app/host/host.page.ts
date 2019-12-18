import { Component, OnInit } from '@angular/core';
import { CarparkdbService } from '../carparkdb.service'
import { database } from 'firebase'
import { ProfiledbService } from '../profiledb.service'

@Component({
  selector: 'app-host',
  templateUrl: './host.page.html',
  styleUrls: ['./host.page.scss'],
})
export class HostPage implements OnInit {

  constructor(private carparkdb: CarparkdbService, private profiledb: ProfiledbService) { }

  ngOnInit() {
  }
  addCarpark() {
    this.carparkdb.addCarpark();
  }
}
