import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VotesPage } from './votes.page';

describe('VotesPage', () => {
  let component: VotesPage;
  let fixture: ComponentFixture<VotesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(VotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
