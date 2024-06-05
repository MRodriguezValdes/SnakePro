import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./register/register.component";
import {canActivate, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {ScoreboardsComponent} from "./scoreboards/scoreboards.component";
import {ContactComponent} from "./contact/contact.component";
import {LoginGuardian} from "./login/login-guardian";

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate:[LoginGuardian]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'scoreboards', component: ScoreboardsComponent,canActivate:[LoginGuardian]},
  {path: 'contact', component: ContactComponent, canActivate:[LoginGuardian]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


}
