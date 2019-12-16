import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../models/user.model'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfiledbService {

  private userId: string;
  private name: string;
  private username: string;
  private profile: User;

  profile$: Observable<User>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {
    this.userId = this.afAuth.auth.currentUser.uid;
    this.name = this.afAuth.auth.currentUser.displayName;
    this.username = this.afAuth.auth.currentUser.email;
    this.profile = {
      username: this.username,
      uid: this.userId,
      phonenumber: null,
      name: this.name,
      host: false
    };
  }

  addUser() {
    this.db.collection('profiles', ref =>
      ref.where('uid', '==', this.userId)).get()
      .subscribe(profile => {
        if (profile.empty) {
          this.db.collection('profiles').add(this.profile);
          console.log('profile added!, ' + this.userId);
        } else {
          console.log('profile existed!, ' + this.userId);
          return;
        }
      });
  }
  getProfile() {
    this.profile$ = this.db.collection<User>('profiles', ref => ref.where('uid', '==', this.userId)).valueChanges()
    .pipe(
      map(profiles => {
        const profile = profiles[0];
        console.log(profile);
        return profile;
      })
    );
    return this.profile$;
  }

  getDisplayName() {
    return this.name;
  }

}
