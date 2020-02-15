import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsermgmtService } from '../services/usermgmt.service'
import { Observable, ReplaySubject } from 'rxjs';
import { User } from '../../models/user.model'
import { ProfiledbService } from '../services/profiledb.service'
import { AngularFireStorage } from '@angular/fire/storage';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  notChanged: Boolean = true
  upload: boolean = false
  uploading: boolean = false

  name: string ='';
  phonenumber: string ='';
  username: string='';
  url: string='';
  showBar: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private userm: UsermgmtService,
    private profiledb: ProfiledbService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit() {
    const profileRef$ = this.profiledb.getProfile();
    profileRef$
      .pipe(
        takeUntil(this.destroyed$),
        filter(data => typeof data !== 'undefined')
      )
      .subscribe(event => {
        if (event) {
          this.name = event.name;
          this.phonenumber = event.phonenumber;
          this.url = event.url;
          this.username = event.username;
        } else {
          console.log(`error`);
        }
      });
  }

  logout() {
    this.userm.logout();
  }

  enableSave(event?: Event) {
    this.notChanged = false;
  }

  async save(): Promise<void> {
    this.showBar = true;
    await this.profiledb.updateProfile(this.name, this.phonenumber, this.url);
    this.showBar = false;
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
      fileRef.getDownloadURL().pipe(takeUntil(this.destroyed$)).subscribe(url => {
        this.url = url;
        this.uploading = false;
        this.enableSave();
      })
    })

    this.upload = false;
  }
  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
