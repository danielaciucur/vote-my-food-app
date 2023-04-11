import { createSelector } from '@ngrx/store';
import * as appState from '../app.state';
import { MachineProduct, VotingHistory } from '../products/machine-product.model';

export const selectProductFeature = (state: appState.AppState) => state.products;
export const selectVotedItemsFeature = (state: appState.AppState) => state.votingHistory;


export const getProducts = createSelector(
  selectProductFeature,
  (products: MachineProduct[]) => products
);

export const getVotingHistory = createSelector(
  selectVotedItemsFeature,
  (votingHistory: VotingHistory[]) => votingHistory
  
)