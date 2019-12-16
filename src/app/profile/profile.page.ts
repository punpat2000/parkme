import { Component, OnInit } from '@angular/core';
import { UsermgmtService } from '../usermgmt.service'
import { ProfiledbService } from '../profiledb.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  name: String
  changed: Boolean=true

  constructor(
    private userm: UsermgmtService,
    private profile: ProfiledbService,
  ) { }

  ngOnInit() {
    this.name = this.profile.getDisplayName()
  }

  logout() {
    this.userm.logout();
  }

  enableSave() {
    this.changed = false
  }

  save() {
    
  }
}
