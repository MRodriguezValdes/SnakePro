import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  /**
   * apiUrl is a string that represents the URL of the API endpoint for sending the contact form.
   */
  private apiUrl = 'http://localhost:5273/api/Contact/send';

  /**
   * The constructor for the ContactService class.
   * It injects the HttpClient service.
   * @param {HttpClient} http - The Angular HttpClient service for making HTTP requests.
   */
  constructor(private http: HttpClient) {
  }

  /**
   * The sendContactForm method sends the contact form data to the API endpoint.
   * It makes a POST request to the apiUrl with the data as the request body.
   * @param {any} data - The contact form data.
   * @returns {Observable<any>} An Observable that contains the response from the API endpoint.
   */
  sendContactForm(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
