import { Component } from '@angular/core';
import { CarparkdbService } from '../carparkdb.service'
import { database } from 'firebase'
import { ProfiledbService } from '../profiledb.service'


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  lots = [];
  displayname: string;
  user: string;

  constructor(private carparkdb: CarparkdbService, private profiledb: ProfiledbService
  ) {
    this.profiledb.getProfile().subscribe(event => {
      if (event) {
        this.displayname = event.name;
        this.user = event.uid;
      } else {
        console.log('error');
      }
    })
  }

  ngOnInit() {
    this.displayCarpark();
  }
  sliderConfig = {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 20,
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    }

  }

  displayCarpark() {
    database().ref('lots').on('value', resp => {
      if (resp) {
        this.lots = [];
        resp.forEach(childSnapshot => {
          const lot = childSnapshot.val();
          lot.key = childSnapshot.key;
          this.lots.push(lot);
          //console.log(lot.status)
        })
      } else {
        console.log('error')
      }
    });
  }
  bookCarpark(key:string){
    database().ref('/lots/'+key).update({status:false,user:this.user});
  }
  unbookCarpark(key:string){
    database().ref('/lots/'+key).update({status:true,user:""});
  }
}
