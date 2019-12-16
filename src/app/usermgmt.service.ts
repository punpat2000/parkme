import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UsermgmtService {

  constructor(private afAuth: AngularFireAuth) { }

  logout() {
    console.log('logout')
    this.afAuth.auth.signOut().then(() => {
      location.reload();
    })
  }
}
