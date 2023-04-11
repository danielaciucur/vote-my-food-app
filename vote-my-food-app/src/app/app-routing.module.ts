import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'products',
    loadChildren: () =>
      import('../app/products/products.module').then((p) => p.ProductsModule),
  },
  {
    path: 'votes',
    loadChildren: () =>
      import('../app/votes/votes.module').then((p) => p.VotesModule),
  },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
