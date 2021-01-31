import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskRequirementsPageView } from './task-requirements.view';

describe('TaskRequirementsPageView', () => {
  let component: TaskRequirementsPageView;
  let fixture: ComponentFixture<TaskRequirementsPageView>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskRequirementsPageView ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskRequirementsPageView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
