import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../../models/user.model';
import { map, tap } from 'rxjs/operators';
import { AlertController } from '@ionic/angular'
import { Observable, of, ReplaySubject } from 'rxjs';
import { switchMap, take, shareReplay } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import * as _ from 'lodash';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  private userId: string;
  public name: string;
  private user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private alertController: AlertController
  ) {
    this.userInitialize();
  }

  private userInitialize(): void {
    this.user$ = this.afAuth.authState.pipe<firebase.User, firebase.User, User, User>(
      untilDestroyed(this),
      tap(user => this.userId = user ? user.uid : null),
      switchMap(user => user ? this.db.doc<User>(`profiles/${user.uid}`).valueChanges() : of(null)),
      shareReplay(1),
    )
    this.afAuth.auth.onAuthStateChanged((user: firebase.User) => {
      if (user) {
        this.userId = user.uid;
        const userRef: AngularFirestoreDocument<User> = this.db.doc(`profiles/${user.uid}`);
        const data: User = this.userDefault(user);
        userRef.set(data, { merge: true });
      }
    });
  }

  private userDefault(user: firebase.User): User {
    const data: User = {
      username: user.email,
      uid: user.uid,
      name: user.displayName,
      url: user.photoURL
    }
    return data;
  }

  ngOnDestroy() { }


  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
    alert.onDidDismiss();
  }


  async updateProfile(name: string, phonenumber: string, url: string): Promise<void> {
    if (name.length <= 0) {
      this.showAlert('Oh no!', 'Please enter name');
      console.log('error');
      return;
    }

    this.afAuth.auth.currentUser.updateProfile({ photoURL: url });
    await this.profile
      .pipe(take(1), map(user => user ? user.uid : null))
      .toPromise()
      .then(uid => {
        if (uid) {
          this.db.doc(`profiles/${uid}`).update({
            displayName: name,
            phonenumber: phonenumber ? phonenumber : '',
            url: url,
          })
        };
      })
      .catch(console.log);
    this.showAlert('Done!', 'Your profile has been updated');
    console.log('Profile updated');
  }

  get uid(): string {
    return this.userId;
  }

  get profile(): Observable<User> {
    return this.user$;
  }

  setNotHost(): void {
    this.db.doc(`profiles/${this.userId}`).update({ host: false }).catch(console.log);
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.auth.signOut();
      this.router.navigate(['login']);
    } catch (e) {
      throw new Error();
    }
  }

}
