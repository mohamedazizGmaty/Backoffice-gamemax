import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPacksComponent } from './packs_subs/components/all-packs/all-packs.component';
import  {AddPackComponent}   from "./packs_subs/components/add-pack/add-pack.component";
import  {AllSubsComponent}   from "./packs_subs/components/all-subs/all-subs.component";
import {SubscribersComponent} from "./packs_subs/components/subscribers/subscribers.component"
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
import { FaqComponent } from './support/faq/faq.component';

import {AddGameComponent} from "./games/components/add-game/add-game.component";
import {GameListComponent} from "./games/components/game-list/game-list.component";
import {MarketplaceComponent} from "./games/components/marketplace/marketplace.component";
import {AddArticleComponent} from "./games/components/add-article/add-article.component";
import {ArticleDetailsComponent} from "./games/components/article-details/article-details.component";
import {CouponComponent} from "./games/components/coupon/coupon.component";


const routes: Routes = [
  {path:'allPacks', component: AllPacksComponent},
  {path:'addPacks', component: AddPackComponent},
  {path:'allSubs', component: AllSubsComponent},
  {path:'subscribers', component: SubscribersComponent},
/////Rasslen khedmtou
  {path:'signin', component: SignInComponent},
  {path:'lostpassword', component: LostPasswordComponent},
  {path:'signout', component: SignOutComponent},
  {path:'resetpassword', component: ResetPasswordComponent},
  {path:'listusers', component: ListUsersComponent},
  {path:'userdetails/:username', component: UserDetailsComponent},
  {path:'admins', component: AdminsComponent},
  {path:'banuser/:id', component: BanuserComponent},
  {path:'unbanuser/:id', component:UnbanuserComponent } ,
  {path:'dashboarduser', component:DahsboardUserComponent } ,
  {path:'admindetails', component:AdminsdetailComponent } ,
  {path:'faq', component: FaqComponent},
  {path:'addGame', component: AddGameComponent},
  {path:'games', component: GameListComponent},
  {path:'marketplace', component: MarketplaceComponent},
  {path:'addArticle', component: AddArticleComponent},
  {path:'articleDetail/:id', component: ArticleDetailsComponent},
  {path:'coupon', component: CouponComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
