import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsPage } from './products.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ProductsPageRoutingModule } from './products-routing.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { ProductsEffect } from '../store/effects/product.effect';
import { reducer } from '../store/reducers/products.reducer';
import { HammerModule } from '@angular/platform-browser';

@NgModule({
  declarations: [ProductsPage],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ProductsPageRoutingModule,
    HammerModule,
    StoreModule.forFeature('products', reducer),
    EffectsModule.forFeature([ProductsEffect])
  ],
  exports: [ProductsPage]
})
export class ProductsModule { }
