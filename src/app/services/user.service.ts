import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../../models/user.model';
import { map, filter } from 'rxjs/operators';
import { AlertController } from '@ionic/angular'
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {

  private userId: string;
  name: string;
  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private alertController: AlertController
  ) {
    this.user$ = this.afAuth.authState.pipe(
      untilDestroyed(this),
      switchMap(user => user ? this.db.doc<User>(`profiles/${user.uid}`).valueChanges() : of(null)),
    )
    this.afAuth.auth.onAuthStateChanged(user => {
      if (user) {
        this.userId = user.uid;
        const userRef: AngularFirestoreDocument<User> = this.db.doc(`profiles/${user.uid}`);
        const data: User = {
          username: user.email,
          uid: user.uid,
          name: user.displayName,
          url: user.photoURL
        }
        userRef.set(data, { merge: true });
      }
    });
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


  async updateProfile(name: string, phonenumber: string, url: string) {
    let info = {
      displayName: name,
      url: url,
    }
    if (phonenumber) {
      info = _.assign(info, { phonenumber: phonenumber });
    }
    if (name.length <= 0) {
      this.showAlert('Oh no!', 'Please enter name');
      console.log('error');
      return;
    }
    this.afAuth.auth.currentUser.updateProfile({ photoURL: url });
    await this.db.collection<User>('profiles').doc(this.userId)
      .update({
        displayName: name,
        phonenumber: phonenumber ? phonenumber : '',
        url: url,
      });
    this.showAlert('Done!', 'Your profile has been updated');
    console.log('Profile updated');
  }

  get profile(): Observable<User> {
    return this.user$;
  }

  getProfile() {
    return this.db.collection<User>('profiles', ref => ref.where('uid', '==', this.userId))
      .valueChanges()
      .pipe(
        map(profiles => {
          const profile = profiles[0];
          return profile;
        }),
        filter(value => typeof value !== 'undefined'),
      );
  }

  getProfilebyID(userID: string) {
    return this.db.collection<User>('profiles', ref => ref.where('uid', '==', userID)).valueChanges()
      .pipe(
        map(profiles => {
          const profile = profiles[0];
          return profile;
        }),
        filter(value => typeof value !== 'undefined'),
      );
  }

  getId() {
    return this.userId;
  }

  setNotHost() {
    this.db.collection('profiles')
      .doc(this.userId)
      .update({ host: false })
      .catch(e => console.log(e));
  }

}
