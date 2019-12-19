import { Component, OnInit } from '@angular/core';
import { database } from 'firebase'
import { ProfiledbService } from '../../profiledb.service'
import { CarparkdbService } from '../../carparkdb.service'

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {
  private lots = [];
  private uid:string;
  private phonenumber: string;
  
  constructor(private carparkdb: CarparkdbService, private profiledb: ProfiledbService) { 
    this.profiledb.getProfile().subscribe(event => {
      this.uid = event.uid;
    });

  }

  ngOnInit() {
    this.displayCarpark();
  }
  

  displayCarpark() {
    database().ref('lots').on('value', resp => {
      if (resp) {
        this.lots = [];
        resp.forEach(childSnapshot => {
          const lot = childSnapshot.val();
          if (!lot.status&&(this.profiledb.getId() === lot.host || this.profiledb.getId() === lot.user)) {

            lot.key = childSnapshot.key;
            this.lots.push(lot);
            //console.log(lot.status)
          } else {
            console.log("error");
          }
        })
      } else {
        console.log('error')
      }
    });
  }

  unbookCarpark(key:string){
    database().ref('/lots/'+key).update({status:true,user:""});
  }

}
