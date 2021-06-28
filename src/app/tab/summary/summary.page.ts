import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';
import { UserService } from 'src/app/core/services';
import { filter } from 'rxjs/operators';
import { Carpark } from 'src/app/core/models';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {
  lots: Array<Carpark> = [];
  uid: string = '';
  phonenumber: string;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.profile
      .pipe(filter((data) => !!data && typeof data !== 'undefined'))
      .subscribe((event) => {
        this.uid = event.uid;
      });
    this.displayCarpark();
  }

  displayCarpark(): void {
    firebase
      .database()
      .ref('lots')
      .on('value', (resp) => {
        if (resp) {
          this.lots = [];
          resp.forEach((childSnapshot) => {
            const lot = childSnapshot.val();
            if (
              !lot.status &&
              (this.userService.uid === lot.host ||
                this.userService.uid === lot.user)
            ) {
              lot.key = childSnapshot.key;
              this.lots.push(lot);
              //console.log(lot.status)
            }
          });
        } else {
          console.log('error');
        }
      });
  }

  unbookCarpark(key: string): void {
    firebase
      .database()
      .ref('/lots/' + key)
      .update({ status: true, user: '' })
      .catch((e) => console.log(e));
  }
}
