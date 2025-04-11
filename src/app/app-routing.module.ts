import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPacksComponent } from './packs_subs/components/all-packs/all-packs.component';
import  {AddPackComponent}   from "./packs_subs/components/add-pack/add-pack.component";

const routes: Routes = [
  {path:'allPacks', component: AllPacksComponent},
  {path:'addPacks', component: AddPackComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
