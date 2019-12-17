import { Component, OnInit } from '@angular/core';
import { ProfiledbService } from '../profiledb.service'

@Component({
  selector: 'app-tab',
  templateUrl: './tab.page.html',
  styleUrls: ['./tab.page.scss'],
})
export class TabPage implements OnInit {

  constructor(private profiledb: ProfiledbService) {}

  ngOnInit() {
    //this.profiledb.addUser();
    console.log('Welcome!');
  }

}
