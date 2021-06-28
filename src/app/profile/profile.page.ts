import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/services';
import { AngularFireStorage } from '@angular/fire/storage';
import { filter } from 'rxjs/operators';
import { User } from '../core/models';
import { Observable } from 'rxjs';
import { isNil } from 'lodash';
import { shareReplay, take } from 'rxjs/operators';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  notChanged: boolean = true;
  uploading: boolean = false;
  user$: Observable<User>;
  name: string = '';
  phonenumber: string = '';
  url!: string;
  showBar: boolean = false;

  constructor(
    private userService: UserService,
    private storage: AngularFireStorage
  ) {}

  ngOnInit(): void {
    this.user$ = this.userService.profile.pipe(
      filter((data) => !isNil(data)),
      shareReplay(1)
    );
    this.user$.subscribe((data) => {
      this.name = data.displayName ?? data.name;
      this.phonenumber = data.phonenumber ?? '';
      this.url = data.url;
    });
  }

  logout() {
    this.userService.logout();
  }

  enableSave(event?: Event) {
    this.notChanged = false;
  }

  async save(): Promise<void> {
    this.showBar = true;
    await this.userService.updateProfile(this.name, this.phonenumber, this.url);
    this.showBar = false;
    this.notChanged = true;
    this.url = null;
  }

  uploadFile(event: File) {
    // The File object
    const file = event;

    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    this.uploading = true;

    const path = `profilepictures/${new Date().getTime()}_${file.name}`;
    this.storage.upload(path, file).then(() => {
      const fileRef = this.storage.ref(path);
      fileRef
        .getDownloadURL()
        .pipe(take(1))
        .subscribe((url) => {
          this.url = url;
          this.uploading = false;
          this.enableSave();
        });
    });
  }
}
