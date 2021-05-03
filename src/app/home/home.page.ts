import { Component, OnInit, OnDestroy } from '@angular/core';
import { database } from 'firebase';
import { UserService } from '../core/services';
import { filter } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  lots$: Subject<database.DataSnapshot> = new Subject();
  lots = [];
  displayname: string;
  user: string;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.profile
      .pipe(
        filter(data => !!data && typeof data !== 'undefined')
      )
      .subscribe(event => {
        if (event) {
          this.displayname = event.displayName || event.name;
          this.user = event.uid;
        } else {
          console.log('error');
        }
      });
    this.displayCarpark();
    this.getLotsInfo();
  }
  ngOnDestroy(): void {
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
    },
  };

  getLotsInfo() {
    database().ref(`lots`).on('value', data => {
      if (data.exists){
        this.lots$.next(data.val());
      }
    });
  }

  displayCarpark(): void {
    database().ref('lots').on('value', resp => {
      if (resp.exists) {
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
  bookCarpark(key: string) {
    database().ref('/lots/' + key).update({ status: false, user: this.user });
  }
  unbookCarpark(key: string) {
    database().ref('/lots/' + key).update({ status: true, user: "" });
  }
}
