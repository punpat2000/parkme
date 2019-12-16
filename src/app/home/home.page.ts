import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private afAuth: AngularFireAuth
  ) {}
  
  ngOnInit() {
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      location.reload();
    })
  }
}
