import { Injectable } from '@angular/core';
import {
  CreateAddressRequest,
  CreateAddressResponse,
} from '@internal-types/api/CreateAddress';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReadAddressResponse } from '@internal-types/api/ReadAddress';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private _http: HttpClient) {}

  public createAddress(
    addressee: string,
    street1: string,
    street2: string,
    town: string,
    county: string,
    postcode: string
  ): Observable<CreateAddressResponse> {
    return this._http.post<CreateAddressResponse>('/api/address', {
      addressee: addressee,
      street1: street1,
      street2: street2,
      town: town,
      county: county,
      postcode: postcode,
    } as CreateAddressRequest);
  }

  public readAddress(guid: string): Observable<ReadAddressResponse> {
    return this._http.get<ReadAddressResponse>(`/api/address/${guid}`);
  }
}
