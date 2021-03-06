import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class CarparkService {
  constructor(private userService: UserService, private db: AngularFirestore) {}

  async addCarpark(
    location: string,
    comment: string,
    url: string
  ): Promise<void> {
    try {
      const newData = firebase.database().ref('/lots').push();
      await Promise.all([
        newData.set({
          host: this.userService.uid,
          user: '',
          status: true,
          location: location,
          comment: comment,
          url: url,
          date: Date(),
        }),
        this.db.doc(`profiles/${this.userService.uid}`).update({ host: true }),
      ]);
      this.userService.showAlert('Done!', 'Your location has been added!');
      console.log('addcarpark succeeded');
    } catch (e) {
      console.error(e);
    }
  }
}
