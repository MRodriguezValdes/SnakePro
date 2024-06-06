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
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {environment} from "../environments/environment";
import { RegisterComponent } from './register/register.component';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import { ScoreboardsComponent } from './scoreboards/scoreboards.component';
import { ScoreItemComponent } from './scoreboards/score-item/score-item.component';
import {BodyClassDirective} from "./body-class.directive";
import { ContactComponent } from './contact/contact.component';
import { StartingMenuComponent } from './starting-menu/starting-menu.component';
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SettingsComponent,
    ErrorsComponent,
    GameOverComponent,
    PauseComponent,
    PauseComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    ScoreboardsComponent,
    ScoreItemComponent,
    RegisterComponent,
    BodyClassDirective,
    ContactComponent,
    StartingMenuComponent
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
    SnakeCommunicationsService,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
