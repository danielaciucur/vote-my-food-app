import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap } from 'rxjs';
import { loadProducts, loadProductsSuccess } from '../actions/products.action';
import { MachineProduct } from 'src/app/products/machine-product.model';
import { ApiService } from 'src/app/api.service';

@Injectable()
export class ProductsEffect {
    private CATEGORY_FILTER = 'Hauptspeisen - Mains';

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
  ) {}

  loadProductsByCategory$ = createEffect(() =>
    this.actions$.pipe(ofType(loadProducts),
      mergeMap(() => {
        return this.apiService
          .getProducts()
          .pipe(map((data) => loadProductsSuccess({ data: data.data.machineProducts.filter((product: MachineProduct) =>
            product.category.name.includes(this.CATEGORY_FILTER)) })));
      })
    )
  );
}