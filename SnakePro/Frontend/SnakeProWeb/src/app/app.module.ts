import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SnakeCommunicationsService} from "../services/snake-communications.service";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { NavbarComponent } from './navbar/navbar.component';
import { SettingsComponent } from './settings/settings.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { ErrorsComponent } from './errors/errors.component';
import { GameOverComponent } from './game-over/game-over.component';
import { PauseComponent } from './pause/pause.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SettingsComponent,
    ErrorsComponent,
    GameOverComponent,
    PauseComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideClientHydration(),
    SnakeCommunicationsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
