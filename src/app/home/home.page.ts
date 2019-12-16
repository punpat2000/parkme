import { Component } from '@angular/core';
import { UsermgmtService} from '../usermgmt.service'
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private afAuth: AngularFireAuth, private userm: UsermgmtService
  ) {}
  
  ngOnInit() {
  }

  logout() {
    this.userm.logout();
  }
}
