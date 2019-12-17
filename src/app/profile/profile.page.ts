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
  notChanged: Boolean = true

  name: string;
  phonenumber: string;
  username: string;
  profile$: Observable<User>;

  constructor(private userm: UsermgmtService, private profiledb: ProfiledbService) {
    this.profile$ = this.profiledb.getProfile();
    this.setName();
    this.setPhonenumber(); 
  }
  setName(){
    this.profile$.subscribe(event => {
      this.name = event.name;
    });
    console.log(this.name + ' @setname');
  }

  setPhonenumber(){
    this.profile$.subscribe(event => {
      this.phonenumber = event.phonenumber;
    });
  }

  ngOnInit() {
  }

  logout() {
    this.userm.logout();
  }

  enableSave() {
    this.notChanged = false;
  }

  async save() {
    await this.profiledb.updateProfile(this.name,this.phonenumber);
    console.log('back to save');
    this.notChanged = true;
  }
}
