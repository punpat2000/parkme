import { Component, OnInit } from '@angular/core';
import { LoadingEventService } from 'src/app/services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.page.html',
  styleUrls: ['./tab.page.scss'],
})
export class TabPage implements OnInit {

  $loadingStatus: Observable<boolean>;

  constructor(
    private lds: LoadingEventService
  ) {
    this.$loadingStatus = this.lds.eventEmitter();
  }

  ngOnInit() {
  }

}
