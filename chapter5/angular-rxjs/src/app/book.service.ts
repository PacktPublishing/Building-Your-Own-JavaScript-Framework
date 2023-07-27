// Required Angular core and RxJS imports.
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root' // This service should be created by the root application injector.
})
export class BookService {

    // The API url from which the HttpClient will be fetching data.
    private apiUrl = 'https://api.packt.com/api/v1/test'; // Replace with your API url

    // Injecting HttpClient into the service via the constructor.
    constructor(private http: HttpClient) { }

    // A method to get data from the API. This returns an Observable.
    getData(): Observable<any> {
        // HttpClient.get returns an Observable, to which we can attach retry and error handling logic.
        return this.http.get(this.apiUrl)
            .pipe(
                // If the request fails, retry it once.
                retry(3),
                // Handle errors from the API call.
                catchError(this.handleError)
            )
    }

    // A private error handling method.
    private handleError(error: HttpErrorResponse) {
        // Distinguish between client-side and server-side errors.
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // Return an observable with a user-facing error message.
        return throwError('Something bad happened; please try again later.');
    }
}
