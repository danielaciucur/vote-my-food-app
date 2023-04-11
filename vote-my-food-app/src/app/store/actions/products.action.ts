import { createAction, props } from '@ngrx/store';
import { MachineProduct, VoteEnum, VotingHistory } from 'src/app/products/machine-product.model';

export const loadProducts = createAction(
  '[Products] load products'
);

export const loadProductsSuccess = createAction(
  '[Products] load products success',
  props<{ data: MachineProduct[] }>()
);

export const removeItem = createAction(
  '[Products] Remove Item'
);

export const updateItem = createAction(
  '[Products] Update',
  props<{ vote: VoteEnum, id: string }>()
);

export const addVotedItem = createAction(
  '[Votes] Add Object',
  props<{ object: VotingHistory }>()
);

export const loadVotingHistory = createAction(
  '[Votes] load votes success'
);
