import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class UsermgmtService {
  constructor(private afAuth: AngularFireAuth) { }

  async logout():Promise<void> {
    try {
      await this.afAuth.auth.signOut();
      location.reload();
    } catch (e) {
      throw new Error();
    }
  }
}
