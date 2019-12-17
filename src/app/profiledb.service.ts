import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User } from '../models/user.model'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertController } from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class ProfiledbService {

  profile$: Observable<User>;
  userId: string;
  name: string;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private alertController: AlertController) {
    this.userId = this.afAuth.auth.currentUser.uid;
    this.db.collection('profiles', ref =>
      ref.where('uid', '==', this.userId)).get()
      .subscribe(profile => {
        if (profile.empty) {
          this.db.collection('profiles').doc(this.userId).set({
            username: this.afAuth.auth.currentUser.email,
            uid: this.userId,
            phonenumber: '',
            name: this.afAuth.auth.currentUser.displayName,
            host: false
          });
          console.log('profile added!, ' + this.userId);
        } else {
          console.log('profile existed!, ' + this.userId);
          return;
        }
      });
  }
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }



  async updateProfile(name: string, phonenumber: string) {
    if (name.length > 0) {
      await this.db.collection('profiles').doc(this.userId).update({ name: name, phonenumber: phonenumber });
      await this.showAlert('Done!', 'Your profile has been updated')
      console.log('Profile updated')
    } else {
      await this.showAlert('Oh no!', 'Please enter name')
      console.log('error')
    }
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

}
