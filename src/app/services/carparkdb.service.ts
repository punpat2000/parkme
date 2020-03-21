import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { database } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class CarparkdbService {
  constructor(
    private userService: UserService,
    private db: AngularFirestore
  ) { }

  async addCarpark(location: string, comment: string, url: string): Promise<void>{
    try{
      const newData = database().ref('/lots').push();
    await newData.set({
      host: this.userService.getId(),
      user: "",
      status: true,
      location: location,
      comment: comment,
      url: url,
      date: Date()
    });
    await this.db.collection('profiles').doc(this.userService.getId()).update({host: true});
    this.userService.showAlert('Done!', 'Your location has been added!');
    console.log('addcarpark succeeded');
    } catch(e){
      throw e;
    }
  }
}
