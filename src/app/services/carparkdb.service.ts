import { Injectable } from '@angular/core';
import { ProfiledbService } from './profiledb.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { database } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CarparkdbService {
  constructor(
    private profiledb: ProfiledbService,
    private db: AngularFirestore
  ) { }

  async addCarpark(location: string, comment: string, url: string): Promise<void>{
    try{
      const newData = database().ref('/lots').push();
    await newData.set({
      host: this.profiledb.getId(),
      user: "",
      status: true,
      location: location,
      comment: comment,
      url: url,
      date: Date()
    });
    await this.db.collection('profiles').doc(this.profiledb.getId()).update({host: true});
    this.profiledb.showAlert('Done!', 'Your location has been added!');
    console.log('addcarpark succeeded');
    } catch(e){
      throw e;
    }
  }
}
