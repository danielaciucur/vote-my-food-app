import { Component, EventEmitter, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api.service';
import { AppState } from '../app.state';
import { VoteEnum, VotingHistory } from '../products/machine-product.model';
import { loadVotingHistory } from '../store/actions/products.action';
import { getVotingHistory } from '../store/product.selector';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.page.html',
  styleUrls: ['./votes.page.scss'],
})
export class VotesPage implements OnInit {
  votedItems$ = new BehaviorSubject<VotingHistory[]>([]);

  constructor(private apiService: ApiService) { 
    this.votedItems$.next(JSON.parse(sessionStorage.getItem('votedItems') || '{}'));
    console.log(this.votedItems$.getValue());
  }

  ngOnInit() {
   
  }

  resetVotes() {
    sessionStorage.removeItem('votedItems');
    this.votedItems$.next([]);
  }

}
