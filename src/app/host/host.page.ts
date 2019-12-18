import { Component, OnInit } from '@angular/core';
import { CarparkdbService } from '../carparkdb.service'
import { ProfiledbService } from '../profiledb.service'
import { User } from '../../models/user.model'
import { database } from 'firebase'
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-host',
  templateUrl: './host.page.html',
  styleUrls: ['./host.page.scss'],
})
export class HostPage implements OnInit {
  profile$: Observable<User>;
  userID: string;
  location: string;
  comment: string;
  url: string;
  upload: boolean=false;
  uploading: boolean=false;
  edit: boolean=false;
  info: any;

  constructor(private carparkdb: CarparkdbService, private profiledb: ProfiledbService, private storage: AngularFireStorage) {
    this.profile$ = this.profiledb.getProfile();
    this.profile$.subscribe(resp => {
      this.userID = resp.uid;
      if (resp.host) {
        this.edit = true;
        this.getCarpark();
      }
    })
  }

  ngOnInit() {
  }

  addCarpark() {
    this.carparkdb.addCarpark(this.location, this.comment, this.url);
  }

  getCarpark() {
    database().ref('lots').on('value', resp => {
      if (resp) {
        resp.forEach(childSnapshot => {
          const lot = childSnapshot.val();
          if (lot.host === this.userID) {
            this.location = lot.location;
            this.comment = lot.comment;
            this.url = lot.url;
            console.log(this.location)
            this.info = childSnapshot.val();
            this.info.key = childSnapshot.key;
          }
        })
      } else {
        console.log('error')
      }
    });
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

  editCarpark() {
    database().ref('/lots/'+this.info.key).update({location: this.location, comment: this.comment, url: this.url});
  }
}
