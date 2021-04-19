import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from '../models';
import { tap, pluck } from 'rxjs/operators';
import { AlertController } from '@ionic/angular'
import { Observable, of, ReplaySubject } from 'rxjs';
import { switchMap, take, shareReplay, filter } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import DEFAULT_IMG_URL from './default-img-url';

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
    );
    const onAuthStateChanged$: ReplaySubject<firebase.User> = new ReplaySubject<firebase.User>(1);
    this.afAuth.auth.onAuthStateChanged(onAuthStateChanged$);
    onAuthStateChanged$
      .pipe(filter(user => !_.isNil(user)))
      .subscribe({
        next: this._checkUserDoc.bind(this),
        error: console.log
      });
  }

  private _checkUserDoc(user: firebase.User): void {
    this.userId = user.uid;
    const userRef: AngularFirestoreDocument<User> = this.db.doc(`profiles/${user.uid}`);
    userRef.ref.get().then(doc => {
      if (doc.exists) return;
      const data: User = this.userDefault(user);
      userRef.set(data, { merge: true });
    })
  }

  private userDefault({email, uid, displayName, photoURL}: firebase.User): User {
    const data: User = {
      username: email,
      uid: uid,
      name: displayName,
      url: photoURL ?? DEFAULT_IMG_URL,
    }
    return data;
  }

  ngOnDestroy() { }


  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Ok']
    });
    alert.present();
    return await alert.onDidDismiss();
  }


  async updateProfile(name: string, phonenumber: string, url: string): Promise<void> {
    if (name.length <= 0) {
      this.showAlert('Oh no!', 'Please enter name');
      console.log('error');
      return;
    }
    this.afAuth.auth.currentUser.updateProfile({ photoURL: url });
    await this.userId$
      .pipe(take(1))
      .toPromise()
      .then(uid => {
        if (uid) {
          this.db.doc(`profiles/${uid}`).update({
            displayName: name,
            phonenumber: phonenumber ?? null,
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

  get userId$(): Observable<string> {
    return this.profile.pipe(pluck('uid'));
  }

  get profile(): Observable<User> {
    return this.user$;
  }

  setNotHost(): void {
    this.userId$
      .pipe(take(1))
      .subscribe(uid => {
      this.db.doc(`profiles/${uid}`).update({ host: false }).catch(console.log);
    });
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
