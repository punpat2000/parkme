import { Component, OnInit } from '@angular/core';
import { UsermgmtService } from '../usermgmt.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private userm: UsermgmtService
  ) { }

  ngOnInit() {
  }

  logout() {
    this.userm.logout();
  }
}
