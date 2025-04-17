import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPacksComponent } from './packs_subs/components/all-packs/all-packs.component';
import  {AddPackComponent}   from "./packs_subs/components/add-pack/add-pack.component";
import { SignInComponent } from './user/sign-in/sign-in.component';
import { LostPasswordComponent } from './user/lost-password/lost-password.component';
import { SignOutComponent } from './user/sign-out/sign-out.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';

const routes: Routes = [
   
  {path:'signin', component: SignInComponent},
  {path:'lostpassword', component: LostPasswordComponent},
  {path:'allPacks', component: AllPacksComponent},
  {path:'addPacks', component: AddPackComponent},
  {path:'signout', component: SignOutComponent},
  {path:'resetpassword', component: ResetPasswordComponent},
  // Redirection par défaut
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
