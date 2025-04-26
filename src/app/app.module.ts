import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeadersComponent } from './headers/headers.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { AllPacksComponent } from './packs_subs/components/all-packs/all-packs.component';
import { FormsModule } from '@angular/forms';
import {CommonModule, DatePipe} from '@angular/common';
import { AddPackComponent } from './packs_subs/components/add-pack/add-pack.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AllSubsComponent } from './packs_subs/components/all-subs/all-subs.component';
import { SubscribersComponent } from './packs_subs/components/subscribers/subscribers.component';
import { AuthenticationService } from './user/services/auth.service';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { LostPasswordComponent } from './user/lost-password/lost-password.component';
import { SignOutComponent } from './user/sign-out/sign-out.component';
import { ResetPasswordComponent } from './user/reset-password/reset-password.component';
import { ListUsersComponent } from './user/listusers/listusers.component';
import { UserService } from './user/services/user.service';
import { UserDetailsComponent } from './user/userdetails/userdetails.component';
import { AdminsComponent } from './user/admins/admins.component';
import { BanuserComponent } from './user/banuser/banuser.component';
import { UnbanuserComponent } from './user/unban-user/unban-user.component';
import { DahsboardUserComponent } from './user/dahsboard-user/dahsboard-user.component';

import { AddGameComponent } from './games/components/add-game/add-game.component';
import { GameListComponent } from './games/components/game-list/game-list.component';
import { MarketplaceComponent } from './games/components/marketplace/marketplace.component';
import { AddArticleComponent } from './games/components/add-article/add-article.component';
import { ArticleDetailsComponent } from './games/components/article-details/article-details.component';
import { CouponComponent } from './games/components/coupon/coupon.component';

import { FaqComponent } from './support/faq/faq.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AiChatbotComponent } from './community/ai-chatbot/ai-chatbot.component';
import { ChatbotComponent } from './community/chatbot/chatbot.component';
import { ListPostsComponent } from './community/list-posts/list-posts.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  // Chemin vers tes fichiers de traduction
}
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeadersComponent,
    SidebarComponent,
    AllPacksComponent,
    AddPackComponent,
    AllSubsComponent,
    SubscribersComponent,

    SignInComponent,
    LostPasswordComponent,
    SignOutComponent,
    ResetPasswordComponent,
    ListUsersComponent,
    UserDetailsComponent ,
    AdminsComponent,
    BanuserComponent,
    UnbanuserComponent,
    DahsboardUserComponent,

    AddGameComponent,
    GameListComponent,
    MarketplaceComponent,
    AddArticleComponent,
    ArticleDetailsComponent,
    CouponComponent,

    FaqComponent,

    AiChatbotComponent,
    ChatbotComponent,
    ListPostsComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,

    // Configuration de ngx-translate
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [AuthenticationService , UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
