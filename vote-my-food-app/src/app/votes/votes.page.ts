import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VotingHistory } from '../products/machine-product.model';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.page.html',
  styleUrls: ['./votes.page.scss'],
})
export class VotesPage implements OnInit {
  votedItems$ = new BehaviorSubject<VotingHistory[]>([]);

  constructor() {
    this.votedItems$.next(
      JSON.parse(localStorage.getItem('votedItems') || '{}')
    );
  }

  ngOnInit() {}

  resetVotes() {
    localStorage.removeItem('votedItems');
    this.votedItems$.next([]);
  }
}
