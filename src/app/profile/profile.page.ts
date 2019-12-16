import { Component, OnInit } from '@angular/core';
import { UsermgmtService } from '../usermgmt.service'
import { Observable } from 'rxjs';
import { User } from '../../models/user.model'
import { ProfiledbService } from '../profiledb.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profile$: Observable<User>;

  constructor(
    private userm: UsermgmtService,
    private profiledb: ProfiledbService
  ) { }

  ngOnInit() {
  }
  getProfile(){
    this.profiledb.getProfile();
  }

  logout() {
    this.userm.logout();
  }
}
