import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarparkdbService } from '../services/carparkdb.service'
import { UserService } from '../services/user.service'
import { database } from 'firebase'
import { AngularFireStorage } from '@angular/fire/storage';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-host',
  templateUrl: './host.page.html',
  styleUrls: ['./host.page.scss'],
})
export class HostPage implements OnInit, OnDestroy {
  userID: string;
  name: string = "";
  phonenumber: string = "";
  location: string = "";
  comment: string = "";
  url: string = "";
  upload: boolean = false;
  uploading: boolean = false;
  edit: boolean = false;
  cannotSubmit: boolean = true;
  info: any;

  constructor(
    private carparkdb: CarparkdbService,
    private userService: UserService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.userService.profile
      .pipe(
        untilDestroyed(this),
        filter(data => !!data && typeof data !== 'undefined'),
      )
      .subscribe(resp => {
        this.userID = resp.uid;
        this.name = resp.displayName ? resp.displayName : resp.name;
        this.phonenumber = resp.phonenumber;
        if (resp.host) {
          this.edit = true;
          this.getCarpark();
        }
      });
  }

  ngOnDestroy(): void { }

  addCarpark() {
    this.carparkdb.addCarpark(this.location, this.comment, this.url);
    this.cannotSubmit = true;
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
            //console.log(this.location)
            this.info = childSnapshot.val();
            this.info.key = childSnapshot.key;
          }
        })
      } else {
        console.log('error')
      }
    });
  }

  enableUpload() {
    this.upload = true
  }

  check() {
    if (this.name == "" || this.phonenumber == "" || this.location == "" || this.comment == "" || this.url == "") {
      this.cannotSubmit = true;
    }
    else {
      this.cannotSubmit = false;
    }
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
      fileRef.getDownloadURL().pipe(untilDestroyed(this)).subscribe(url => {
        this.url = url;
        this.uploading = false;
        this.check();
      })
    })
    this.upload = false;
  }

  editCarpark() {
    database().ref('/lots/' + this.info.key).update({ location: this.location, comment: this.comment, url: this.url });
    this.userService.showAlert('Done!', 'Your location has been updated!');
    this.cannotSubmit = true;
  }

  deleteCarpark() {
    database().ref('/lots/' + this.info.key).remove();
    this.userService.setNotHost();
    this.location = "";
    this.comment = "";
    this.url = "";
    this.edit = false;
    this.userService.showAlert('Done!', 'Your location has been deleted!')
    this.check();
  }
}
