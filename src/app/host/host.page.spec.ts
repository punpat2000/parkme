import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HostPage } from './host.page';

describe('HostPage', () => {
  let component: HostPage;
  let fixture: ComponentFixture<HostPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HostPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
