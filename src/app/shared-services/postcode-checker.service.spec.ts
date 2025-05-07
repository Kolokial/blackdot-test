import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { PostcodeCheckerService } from './postcode-checker.service';
import { HttpStatusCode, provideHttpClient } from '@angular/common/http';
import { PostcodeApiResponse } from '../types/postcodes.io/PostcodeApiResponse';
import { of } from 'rxjs';

describe('PostcodeCheckerService', () => {
  let service: PostcodeCheckerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        PostcodeCheckerService,
      ],
    });
    service = TestBed.inject(PostcodeCheckerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return a valid postcode response from API', () => {
    const mockPostcode = 'EC1A 1BB';
    const mockResponse: PostcodeApiResponse = {
      status: HttpStatusCode.Ok,
    };

    service.lookup(mockPostcode).subscribe((response) => {
      expect(response.status).toBe(HttpStatusCode.Ok);
    });

    const req = httpMock.expectOne(
      `https://api.postcodes.io/postcodes/${mockPostcode}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle postcode not found from API', () => {
    const mockPostcode = 'INVALID1';
    const mockErrorResponse = {
      status: HttpStatusCode.NotFound,
    };

    service.lookup(mockPostcode).subscribe((response) => {
      expect(response.status).toBe(HttpStatusCode.NotFound);
    });

    const req = httpMock.expectOne(
      `https://api.postcodes.io/postcodes/${mockPostcode}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockErrorResponse, { status: 404, statusText: 'Not Found' });
  });

  it('should fallback to regex validation when API fails and fail', () => {
    const invalidPostcode = 'INVALID1';

    service.lookup(invalidPostcode).subscribe((response) => {
      expect(response.status).toBe(HttpStatusCode.NotFound);
    });

    const req = httpMock.expectOne(
      `https://api.postcodes.io/postcodes/${invalidPostcode}`
    );
    expect(req.request.method).toBe('GET');
    req.error(new ProgressEvent('Network Error!'));
  });

  it('should fallback to regex validation when API fails and succeed', () => {
    const invalidPostcode = 'IP3 9TS';

    service.lookup(invalidPostcode).subscribe((response) => {
      expect(response.status).toBe(HttpStatusCode.Ok);
    });

    const req = httpMock.expectOne(
      `https://api.postcodes.io/postcodes/${invalidPostcode}`
    );
    expect(req.request.method).toBe('GET');
    req.error(new ProgressEvent('Network Error!'));
  });
});
