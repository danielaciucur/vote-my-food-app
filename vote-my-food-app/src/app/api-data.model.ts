import { MachineProduct } from './products/machine-product.model';

export interface ApiData {
  data: DataObj;
}

export interface DataObj {
  machineProducts: MachineProduct[];
}
