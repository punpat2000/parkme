import { Component, OnInit, OnDestroy } from '@angular/core';
import { database } from 'firebase';
import { ProfiledbService } from '../../services/profiledb.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Park} from 'src/models/carpark.model';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit, OnDestroy {
  lots: Array<Park>=[];
  uid: string = '';
  phonenumber: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private profiledb: ProfiledbService) {
  }

  ngOnInit() {
    this.profiledb.getProfile()
    .pipe(
      takeUntil(this.destroyed$),
      filter(data => typeof data !== 'undefined'))
    .subscribe(event => {
      this.uid = event.uid;
    });
    this.displayCarpark();
  }
  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }


  displayCarpark(): void {
    database().ref('lots').on('value', resp => {
      if (resp) {
        this.lots = [];
        resp.forEach(childSnapshot => {
          const lot = childSnapshot.val();
          if (!lot.status && (this.profiledb.getId() === lot.host || this.profiledb.getId() === lot.user)) {
            lot.key = childSnapshot.key;
            this.lots.push(lot);
            //console.log(lot.status)
          }
        })
      } else {
        console.log('error');
      }
    });
  }

  unbookCarpark(key: string) {
    database().ref('/lots/' + key).update({ status: true, user: "" }).catch(e => console.log(e));
  }

}
