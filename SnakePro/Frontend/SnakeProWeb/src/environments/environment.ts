/**
 * The environment object contains the configuration for the application.
 * It has the following properties:
 * - firebase: an object that contains the configuration for Firebase. It has the following properties:
 *   - apiKey: a string that represents the API key for Firebase.
 *   - authDomain: a string that represents the domain for Firebase authentication.
 *   - databaseURL: a string that represents the URL for the Firebase database.
 *   - projectId: a string that represents the project ID for Firebase.
 *   - storageBucket: a string that represents the storage bucket for Firebase.
 *   - messagingSenderId: a string that represents the sender ID for Firebase messaging.
 *   - appId: a string that represents the app ID for Firebase.
 *   - measurementId: a string that represents the measurement ID for Firebase.
 * - production: a boolean that indicates whether the application is in production mode.
 */
export const environment = {
  firebase: {
    apiKey: "AIzaSyC4K7mi-Xlt2R3BhbZEo7_5yRvxG3xJJeQ",
    authDomain: "snakepro-2bf73.firebaseapp.com",
    databaseURL: "https://snakepro-2bf73-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "snakepro-2bf73",
    storageBucket: "snakepro-2bf73.appspot.com",
    messagingSenderId: "169384997647",
    appId: "1:169384997647:web:53c3c0e1a388f9bc2ac47a",
    measurementId: "G-M4BPJRSBVW",
  },
  production: false
};
