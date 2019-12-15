import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.page.html',
  styleUrls: ['./tab.page.scss'],
})
export class TabPage implements OnInit {
 // @ViewChild('tab',{static :true}) tab:IonTabs
  constructor() { }

  ngOnInit() {
   // this.tab.select('profile');
  }

}
