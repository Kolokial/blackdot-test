import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AddressApiService } from './address-api.service';

import { CreateAddressResponse } from '@internal-types/api/CreateAddress';
import { ReadAddressResponse } from '@internal-types/api/ReadAddress';
import { provideHttpClient } from '@angular/common/http';

describe('AddressService', () => {
  let service: AddressApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        AddressApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(AddressApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('createAddress', () => {
    it('should make a POST request to create an address and return a response', () => {
      const addressData = {
        addressee: 'John Doe',
        street1: '123 Main St',
        street2: 'Apt 4B',
        town: 'Somewhere',
        county: 'SomeCounty',
        postcode: 'AB12 3CD',
      };

      const mockResponse: CreateAddressResponse = {
        addressId: '12345',
        addressee: addressData.addressee,
        street1: addressData.street1,
        street2: addressData.street2,
        town: addressData.town,
        county: addressData.county,
        postcode: addressData.postcode,
      };

      service
        .createAddress(
          addressData.addressee,
          addressData.street1,
          addressData.street2,
          addressData.town,
          addressData.county,
          addressData.postcode
        )
        .subscribe((response) => {
          expect(response.addressId).toBe('12345');
        });

      const req = httpMock.expectOne('/api/address');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(addressData);
      req.flush(mockResponse);
    });
  });

  describe('readAddress', () => {
    it('should make a GET request to read an address and return a response', () => {
      const guid = '12345';
      const mockResponse: ReadAddressResponse = {
        addressId: 'addresss-123',
        addressee: 'John Doe',
        street1: '123 Main St',
        street2: 'Apt 4B',
        town: 'Somewhere',
        county: 'SomeCounty',
        postcode: 'AB12 3CD',
      };

      service.readAddress(guid).subscribe((response) => {
        expect(response.addressee).toBe('John Doe');
        expect(response.town).toBe('Somewhere');
      });

      const req = httpMock.expectOne(`/api/address/${guid}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
