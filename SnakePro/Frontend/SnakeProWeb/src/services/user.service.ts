import { Injectable } from '@angular/core';
import {Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, GithubAuthProvider} from "@angular/fire/auth";
import {CookieService} from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})
export class UserService {
/**
 * token is a string that represents the authentication token of the user. It is null when the user is not logged in.
 */
private token: string | null = null;

/**
 * The constructor for the UserService class.
 * It injects the Auth and CookieService services.
 * @param {Auth} auth - The Firebase Auth service for authentication operations.
 * @param {CookieService} cookies - The CookieService for cookie operations.
 */
constructor(private auth: Auth,private cookies:CookieService) { }

/**
 * The register method registers a new user with the given email and password.
 * @param {any} {email, password} - The email and password of the user.
 * @returns {Promise} A promise that resolves with the user credential.
 */
register({email, password}: any) {
  return createUserWithEmailAndPassword(this.auth, email, password);
}

/**
 * The login method logs in a user with the given email and password.
 * It also sets the authentication token in a cookie.
 * @param {any} {email, password} - The email and password of the user.
 * @returns {Promise} A promise that resolves with the user credential.
 */
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

/**
 * The loginWithGoogle method logs in a user with Google.
 * It also sets the authentication token in a cookie.
 * @returns {Promise} A promise that resolves with the user credential.
 */
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

/**
 * The loginWithGithub method logs in a user with Github.
 * It also sets the authentication token in a cookie.
 * @returns {Promise} A promise that resolves with the user credential.
 */
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

/**
 * The logout method logs out the user and clears the authentication token from the cookie.
 * @returns {Promise} A promise that resolves when the user is logged out.
 */
logout() {
  this.token="";
  this.cookies.set("token",this.token)
  return signOut(this.auth);
}

/**
 * The getToken method gets the authentication token from the cookie.
 * @returns {string} The authentication token.
 */
getToken() {
  return this.cookies.get("token")
}
}
