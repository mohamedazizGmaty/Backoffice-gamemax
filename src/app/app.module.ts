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
import { DatePipe } from '@angular/common';
import { AddPackComponent } from './packs_subs/components/add-pack/add-pack.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from './user/services/auth.service';
import { SignInComponent } from './user/sign-in/sign-in.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeadersComponent,
    SidebarComponent,
    AllPacksComponent,
    AddPackComponent,
  
    SignInComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,


  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
