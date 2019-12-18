import { Component, OnInit } from '@angular/core';
import { CarparkdbService } from '../carparkdb.service'
import { database } from 'firebase'
import { ProfiledbService } from '../profiledb.service'
import { User } from '../../models/user.model'
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-host',
  templateUrl: './host.page.html',
  styleUrls: ['./host.page.scss'],
})
export class HostPage implements OnInit {
  profile$: Observable<User>;
  location: string;
  comment: string;
  url: string;
  upload: boolean=false;
  uploading: boolean=false;

  constructor(private carparkdb: CarparkdbService, private profiledb: ProfiledbService, private storage: AngularFireStorage) {
    this.profile$ = this.profiledb.getProfile();
  }

  ngOnInit() {
  }

  addCarpark() {
    this.carparkdb.addCarpark(this.location, this.comment, this.url);
  }

  enableRegister() {

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

    const path = `locationpictures/${new Date().getTime()}_${file.name}`;
    this.storage.upload(path, file).then(() => {
      const fileRef = this.storage.ref(path);
      fileRef.getDownloadURL().subscribe(url => {
        this.url = url;
        this.uploading = false;
      })
    })

    this.upload = false;
  }
}
