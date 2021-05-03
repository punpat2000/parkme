import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../core/services';
import { filter } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import firebase from 'firebase';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  lots$: Subject<firebase.database.DataSnapshot> = new Subject();
  lots = [];
  displayname: string;
  user: string;

  constructor(
    private userService: UserService,
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
    firebase.database().ref(`lots`).on('value', data => {
      if (data.exists){
        this.lots$.next(data.val());
      }
    });
  }

  displayCarpark(): void {
    firebase.database().ref('lots').on('value', resp => {
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
    firebase.database().ref('/lots/' + key).update({ status: false, user: this.user });
  }
  unbookCarpark(key: string) {
    firebase.database().ref('/lots/' + key).update({ status: true, user: "" });
  }
}

// https://github.com/angular/angularfire/blob/master/docs/rtdb/lists.md