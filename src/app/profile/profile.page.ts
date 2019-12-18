import { Component, OnInit } from '@angular/core';
import { UsermgmtService } from '../usermgmt.service'
import { Observable } from 'rxjs';
import { User } from '../../models/user.model'
import { ProfiledbService } from '../profiledb.service'
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  notChanged: Boolean = true
  upload: boolean = false
  uploading: boolean = false

  name: string;
  phonenumber: string;
  username: string;
  url: string;
  profile$: Observable<User>;

  constructor(private userm: UsermgmtService, private profiledb: ProfiledbService, private storage: AngularFireStorage) {
    this.profile$ = this.profiledb.getProfile();
    this.setName();
    this.setPhonenumber();
    this.setURL();
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

  setURL() {
    this.profile$.subscribe(event => {
      this.url = event.url;
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
    await this.profiledb.updateProfile(this.name,this.phonenumber, this.url);
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

    this.uploading = true;

    const path = `profilepictures/${new Date().getTime()}_${file.name}`;
    this.storage.upload(path, file).then(() => {
      const fileRef = this.storage.ref(path);
      fileRef.getDownloadURL().subscribe(url => {
        this.url = url;
        this.uploading = false;
        this.enableSave();
      })
    })

    this.upload = false;
  }
}
