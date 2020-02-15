import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../../models/user.model';
import { map, filter } from 'rxjs/operators';
import { AlertController } from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class ProfiledbService {

  private userId: string;
  name: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private alertController: AlertController
  ) {
    this.userId = this.afAuth.auth.currentUser.uid;
    const defaultSet = {
      username: this.afAuth.auth.currentUser.email,
      uid: this.userId,
      phonenumber: '',
      name: this.afAuth.auth.currentUser.displayName,
      host: false,
      url: "https://firebasestorage.googleapis.com/v0/b/parkmebysaint.appspot.com/o/blank-profile.png?alt=media&token=4f775ff6-4520-4ecf-b2e0-04148fedaaa7"
    };
    const col = this.db.collection<User>('profiles');
    col.ref.where('uid', '==', this.userId).get()
      .then(user => {
        if (user.empty) {
          col.doc(this.userId)
          .set(defaultSet)
          .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
    // this.db.collection('profiles', ref =>
    //   ref.where('uid', '==', this.userId)).get()
    //   .pipe(filter(data => typeof data !== 'undefined'))
    //   .subscribe(profile => {
    //     if (profile.empty) {
    //       this.db.collection('profiles').doc(this.userId).set({
    //         username: this.afAuth.auth.currentUser.email,
    //         uid: this.userId,
    //         phonenumber: '',
    //         name: this.afAuth.auth.currentUser.displayName,
    //         host: false,
    //         url: "https://firebasestorage.googleapis.com/v0/b/parkmebysaint.appspot.com/o/blank-profile.png?alt=media&token=4f775ff6-4520-4ecf-b2e0-04148fedaaa7"
    //       });
    //       console.log('profile added!');
    //     } else {
    //       console.log('profile existed!');
    //       return;
    //     }
    //   });
  }
  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
    await alert.onDidDismiss();
  }



  async updateProfile(name: string, phonenumber: string, url: string) {
    if (name.length > 0) {
      await this.db.collection('profiles').doc(this.userId).update({ name: name, phonenumber: phonenumber, url: url });
      await this.showAlert('Done!', 'Your profile has been updated');
      //await this.alertController.dismiss();
      console.log('Profile updated')
    } else {
      await this.showAlert('Oh no!', 'Please enter name');
      console.log('error');
    }
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
