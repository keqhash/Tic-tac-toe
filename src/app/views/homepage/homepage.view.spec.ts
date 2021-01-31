import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageView } from './homepage.view';

describe('HomePageView', () => {
  let component: HomePageView;
  let fixture: ComponentFixture<HomePageView>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageView ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
