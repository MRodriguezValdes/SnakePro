import { Injectable } from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, GithubAuthProvider} from "@angular/fire/auth";
import {CookieService} from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token: string | null = null;
  constructor(private auth: Auth,private cookies:CookieService) { }

  register({email, password}: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login({email, password}: any) {
    return signInWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
      // Set the token when the user logs in
      userCredential.user.getIdToken().then((idToken) => {
        this.token = idToken;
        this.cookies.set("token",this.token)
      });
      return userCredential;
    });
  }
  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider()).then((userCredential) => {
      // Set the token when the user logs in
      userCredential.user.getIdToken().then((idToken) => {
        this.token = idToken;
        this.cookies.set("token",this.token);
      });
      return userCredential;
    });
  }

  loginWithGithub(){
    return signInWithPopup(this.auth, new GithubAuthProvider()).then((userCredential) => {
      // Set the token when the user logs in
      userCredential.user.getIdToken().then((idToken) => {
        this.token = idToken;
        this.cookies.set("token",this.token);
      });
      return userCredential;
    });
  }
  logout() {
    this.token="";
    this.cookies.set("token",this.token)
    return signOut(this.auth);
  }

  getToken() {
    return this.cookies.get("token")
  }

}
