import { Component, OnInit, OnDestroy } from '@angular/core';
import { database } from 'firebase'
import { ProfiledbService } from '../services/profiledb.service'
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  lots = [];
  displayname: string;
  user: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private profiledb: ProfiledbService
  ) {}

  ngOnInit(): void {
    this.profiledb.getProfile().pipe(takeUntil(this.destroyed$)).subscribe(event => {
      if (event) {
        this.displayname = event.name;
        this.user = event.uid;
      } else {
        console.log('error');
      }
    });
    this.displayCarpark();
  }
  ngOnDestroy(): void{
    this.destroyed$.next(true);
    this.destroyed$.complete();
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

  displayCarpark(): void {
    database().ref('lots').on('value', resp => {
      if (resp) {
        this.lots = [];
        resp.forEach(childSnapshot => {
          const lot = childSnapshot.val();
          lot.key = childSnapshot.key;
          this.lots.push(lot);
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
