import { Component, OnInit, OnDestroy } from '@angular/core';
import { database } from 'firebase';
import { UserService } from '../services/user.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  lots = [];
  displayname: string;
  user: string;

  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getProfile()
      .pipe(
        untilDestroyed(this),
        filter(data => !!data && typeof data !== 'undefined')
      )
      .subscribe(event => {
        if (event) {
          this.displayname = event.displayName ? event.displayName : event.name;
          this.user = event.uid;
        } else {
          console.log('error');
        }
      });
    this.displayCarpark();
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
  bookCarpark(key: string) {
    database().ref('/lots/' + key).update({ status: false, user: this.user });
  }
  unbookCarpark(key: string) {
    database().ref('/lots/' + key).update({ status: true, user: "" });
  }
}
