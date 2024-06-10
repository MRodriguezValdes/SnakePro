import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {RegisterComponent} from "./register/register.component";
import {canActivate, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {ScoreboardsComponent} from "./scoreboards/scoreboards.component";
import {ContactComponent} from "./contact/contact.component";
import {LoginGuardian} from "./login/login-guardian";

/**
 * routes is an array of route configurations.
 * Each route configuration is an object with the following properties:
 * - path: a string that represents the URL path for the route.
 * - redirectTo: a string that represents the URL path to redirect to. This is used when the path is an empty string ('').
 * - pathMatch: a string that specifies how to match the URL path. This is used in combination with redirectTo.
 * - component: the component to display when the route is activated.
 * - canActivate: an array of services that determine if the route can be activated. In this case, the LoginGuardian service is used.
 */
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
