import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllPacksComponent } from './packs_subs/components/all-packs/all-packs.component';
import  {AddPackComponent}   from "./packs_subs/components/add-pack/add-pack.component";
import {AddGameComponent} from "./games/components/add-game/add-game.component";
import {GameListComponent} from "./games/components/game-list/game-list.component";
import {MarketplaceComponent} from "./games/components/marketplace/marketplace.component";
import {AddArticleComponent} from "./games/components/add-article/add-article.component";
import {ArticleDetailsComponent} from "./games/components/article-details/article-details.component";
import {CouponComponent} from "./games/components/coupon/coupon.component";

const routes: Routes = [
  {path:'allPacks', component: AllPacksComponent},
  {path:'addPacks', component: AddPackComponent},
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
