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
  constructor(private profiledb: ProfiledbService) { }

  addCarpark() {
    const newData = database().ref('/lots').push();
    newData.set({
      host: 'test',
      user: 'test',
      status: true,
      location: '',
      comment: '',
      Date: Date()
    });
    console.log('addcarpark succeeded')
    //this.scroll();
  }
}
