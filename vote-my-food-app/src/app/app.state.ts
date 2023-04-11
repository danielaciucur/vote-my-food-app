import {
  MachineProduct,
  VotingHistory,
} from 'src/app/products/machine-product.model';

export interface AppState {
  products: MachineProduct[];
  votingHistory: VotingHistory[];
  loading: boolean;
  error: any;
}

export const initialState: AppState = {
  products: [],
  votingHistory: [],
  loading: false,
  error: null,
};
