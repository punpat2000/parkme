import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsermgmtService } from '../services/usermgmt.service'
import { UserService } from '../services/user.service'
import { AngularFireStorage } from '@angular/fire/storage';
import { filter } from 'rxjs/operators';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  notChanged: boolean = true
  upload: boolean = false
  uploading: boolean = false
  user$: Observable<User>;
  name: string = '';
  phonenumber: string = '';
  username: string = '';
  url: string = '';
  showBar: boolean = false;

  constructor(
    private userm: UsermgmtService,
    private userService: UserService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    this.user$ = this.userService.profile
      .pipe<User, User>(
        untilDestroyed(this),
        filter(data => !!data && typeof data !== 'undefined')
      );
    this.user$.subscribe(data => {
      this.name = data.displayName ? data.displayName : data.name;
      this.phonenumber = data.phonenumber;
      this.url = data.url;
      this.username = data.username;
    })
  }

  logout() {
    this.userm.logout();
  }

  enableSave(event?: Event) {
    this.notChanged = false;
  }

  async save(): Promise<void> {
    this.showBar = true;
    await this.userService.updateProfile(this.name, this.phonenumber, this.url);
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
      fileRef.getDownloadURL().pipe(untilDestroyed(this)).subscribe(url => {
        this.url = url;
        this.uploading = false;
        this.enableSave();
      })
    })

    this.upload = false;
  }
  ngOnDestroy() {
  }
}
