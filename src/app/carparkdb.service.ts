import { Injectable } from '@angular/core';
import { Carpark } from '../models/carpark.model';
import { Observable } from 'rxjs';
import { ProfiledbService } from './profiledb.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { IonContent } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CarparkdbService {
  

  constructor(private profiledb: ProfiledbService, private db: AngularFirestore, public content: IonContent) { }

  addCarpark() {
    const newData = firebase.database().ref('lots').push();
    newData.set({
      host: 'test',
      user: 'test',
      status: true,
      Date: Date()
    });
    console.log('addcarpark succeeded')
    this.scroll();
  }

  private scroll() {
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 1000);
  }

  

}
