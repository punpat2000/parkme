import { Injectable } from '@angular/core';
import { Carpark } from '../models/carpark.model';
import { Observable } from 'rxjs';
import { ProfiledbService } from './profiledb.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { database } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CarparkdbService {
  constructor(private profiledb: ProfiledbService, private db: AngularFirestore) { }

  addCarpark(location: string, comment: string, url: string) {
    const newData = database().ref('/lots').push();
    newData.set({
      host: this.profiledb.getId(),
      user: "",
      status: true,
      location: location,
      comment: comment,
      url: url,
      date: Date()
    });
    this.db.collection('profiles').doc(this.profiledb.getId()).update({host: true})
    this.profiledb.showAlert('Done!', 'Your location has been added!')
    console.log('addcarpark succeeded')
    //this.scroll();
  }
}
