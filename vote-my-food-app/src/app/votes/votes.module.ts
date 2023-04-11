import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VotesPage } from '../votes/votes.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { VotesPageRoutingModule } from './votes-routing.module';

@NgModule({
  declarations: [VotesPage],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    VotesPageRoutingModule
  ]
})
export class VotesModule { }
