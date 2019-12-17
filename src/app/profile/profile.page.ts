import { Component, OnInit } from '@angular/core';
import { UsermgmtService } from '../usermgmt.service'
import { Observable } from 'rxjs';
import { User } from '../../models/user.model'
import { ProfiledbService } from '../profiledb.service'
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  notChanged: Boolean = true
  upload: boolean = false

  name: string;
  phonenumber: string;
  username: string;
  profile$: Observable<User>;

  task: AngularFireUploadTask;

  constructor(private userm: UsermgmtService, private profiledb: ProfiledbService, private storage: AngularFireStorage) {
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

  enableUpload() {
    this.upload = true
  }

  uploadFile(event: FileList) {
    
 
    // The File object
    const file = event.item(0)
 
    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
     console.error('unsupported file type :( ')
     return;
    }

    const path = `profilepictures/${new Date().getTime()}_${file.name}`;
    this.task = this.storage.upload(path, file)
  }
}
