import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userId: string;


  constructor(
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe(user => {
      if (user) this.userId = user.uid;
    })
  }



  ngOnInit() {
    console.log(this.userId);
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      location.reload();
    })
  }
}
