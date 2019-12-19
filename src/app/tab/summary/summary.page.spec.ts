import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SummaryPage } from './summary.page';

describe('SummaryPage', () => {
  let component: SummaryPage;
  let fixture: ComponentFixture<SummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
