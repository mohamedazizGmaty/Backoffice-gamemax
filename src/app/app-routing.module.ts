import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPacksComponent } from './packs_subs/components/all-packs/all-packs.component';
import  {AddPackComponent}   from "./packs_subs/components/add-pack/add-pack.component";
import  {AllSubsComponent}   from "./packs_subs/components/all-subs/all-subs.component";
import {SubscribersComponent} from "./packs_subs/components/subscribers/subscribers.component"

const routes: Routes = [
  {path:'allPacks', component: AllPacksComponent},
  {path:'addPacks', component: AddPackComponent},
  {path:'allSubs', component: AllSubsComponent},
  {path:'subscribers', component: SubscribersComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
