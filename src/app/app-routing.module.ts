import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPacksComponent } from './packs_subs/components/all-packs/all-packs.component';
import  {AddPackComponent}   from "./packs_subs/components/add-pack/add-pack.component";
import { SignInComponent } from './user/sign-in/sign-in.component';
import { LostPasswordComponent } from './user/lost-password/lost-password.component';
import { SignOutComponent } from './user/sign-out/sign-out.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { ListUsersComponent } from './user/listusers/listusers.component';
import { UserDetailsComponent } from './user/userdetails/userdetails.component';
import { AdminsComponent } from './user/admins/admins.component';
import { BanuserComponent } from './user/banuser/banuser.component';
import { UnbanuserComponent } from './user/unban-user/unban-user.component';
import { DahsboardUserComponent } from './user/dahsboard-user/dahsboard-user.component';
import { AdminsdetailComponent } from './user/adminsdetail/adminsdetail.component';





const routes: Routes = [


  {path:'signin', component: SignInComponent},
  {path:'lostpassword', component: LostPasswordComponent},
  {path:'allPacks', component: AllPacksComponent},
  {path:'addPacks', component: AddPackComponent},
  {path:'signout', component: SignOutComponent},
  {path:'resetpassword', component: ResetPasswordComponent},
  {path:'listusers', component: ListUsersComponent},
  {path:'userdetails/:username', component: UserDetailsComponent},
  {path:'admins', component: AdminsComponent},
  {path:'banuser/:id', component: BanuserComponent},
  {path:'unbanuser/:id', component:UnbanuserComponent } ,
  {path:'dashboarduser', component:DahsboardUserComponent } ,
  {path:'admindetails', component:AdminsdetailComponent } ,
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
