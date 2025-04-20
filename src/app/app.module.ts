import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeadersComponent } from './headers/headers.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { AllPacksComponent } from './packs_subs/components/all-packs/all-packs.component';
import { FormsModule } from '@angular/forms';
import { AddPackComponent } from './packs_subs/components/add-pack/add-pack.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddGameComponent } from './games/components/add-game/add-game.component';
import { GameListComponent } from './games/components/game-list/game-list.component';
import { MarketplaceComponent } from './games/components/marketplace/marketplace.component';
import { AddArticleComponent } from './games/components/add-article/add-article.component';
import { ArticleDetailsComponent } from './games/components/article-details/article-details.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeadersComponent,
    SidebarComponent,
    AllPacksComponent,
    AddPackComponent,
    AddGameComponent,
    GameListComponent,
    MarketplaceComponent,
    AddArticleComponent,
    ArticleDetailsComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
