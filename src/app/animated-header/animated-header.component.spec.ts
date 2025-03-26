import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedHeaderComponent } from './animated-header.component';

describe('AnimatedHeaderComponent', () => {
  let component: AnimatedHeaderComponent;
  let fixture: ComponentFixture<AnimatedHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimatedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
