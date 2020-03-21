import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UsermgmtService {
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  async logout(): Promise<void> {
    try {
      await this.afAuth.auth.signOut();
      this.router.navigate(['login']);
    } catch (e) {
      throw new Error();
    }
  }
}
