import { addVotedItem, loadProducts, loadProductsSuccess, removeItem, updateItem } from '../actions/products.action';
import { createReducer, on } from '@ngrx/store';
import { initialState } from 'src/app/app.state';

export const reducer = createReducer(
  initialState,
  on(loadProducts, (state) => ({ ...state, isLoading: true })),
  on(loadProductsSuccess, (state, {data}) => ({
    ...state,
    isLoading: false,
    products: data,
  })),
  on(removeItem, (state) => {
    return {
      ...state,
      isLoading: false,
      products: state.products.slice(1)
    };
  }),
  on(updateItem, (state, {vote, id}) => {
    const updatedObjects = state.products.map(prod => {
      if (prod.id === id) {
        return {...prod, [vote]: vote}
      }
      return prod;
    });
    return { ...state, products: updatedObjects };
  }),
  on(addVotedItem, (state, { object }) => ({
    ...state,
    votingHistory: [...state.votingHistory, object]
  }))
);
