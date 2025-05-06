import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, retry } from 'rxjs';
import { PostcodeApiResponse } from '../types/postcodes.io/PostcodeApiResponse';

@Injectable({
  providedIn: 'root',
})
export class PostcodeCheckerService {
  private _postCodeApiURL = 'https://api.postcodes.io';
  constructor(private _http: HttpClient) {}

  public lookup(postcode: string): Observable<PostcodeApiResponse> {
    return this._http
      .get<PostcodeApiResponse>(`${this._postCodeApiURL}/postcodes/${postcode}`)
      .pipe(
        catchError((error) => {
          if (error.error.status === HttpStatusCode.NotFound) {
            return of(error.error);
          }
          return this.fallbackValidation(postcode);
        })
      );
  }

  public fallbackValidation(postcode: string): Observable<PostcodeApiResponse> {
    const regex = new RegExp(/^[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}$/i);
    const result = postcode.match(regex);

    return of({
      status: !result ? HttpStatusCode.NotFound : HttpStatusCode.Ok,
    });
  }
}
