import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressDisplayComponent } from './address-display.component';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AddressApiService } from '@shared-services/address-api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { DomSanitizer } from '@angular/platform-browser';
import { HarnessLoader, parallel } from '@angular/cdk/testing';
import { MatListHarness } from '@angular/material/list/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { Store } from '@ngrx/store';

describe('AddressDisplayComponent', () => {
  let component: AddressDisplayComponent;
  let loader: HarnessLoader;
  let fixture: ComponentFixture<AddressDisplayComponent>;
  let mockStore: any;
  let mockAddressService: any;

  beforeEach(() => {
    mockStore = {
      select: jasmine.createSpy().and.returnValue(of(['123', '456'])),
    };

    mockAddressService = {
      readAddress: jasmine.createSpy().and.returnValue(
        of({
          addressId: '123',
          addressee: 'John Doe',
          street1: '123 Main St',
          street2: '',
          town: 'Townsville',
          county: 'Countyshire',
          postcode: '12345',
        })
      ),
    };

    TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatCardModule,
        AddressDisplayComponent,
      ],
      declarations: [],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: AddressApiService, useValue: mockAddressService },
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => '123' }) },
        },
        {
          provide: DomSanitizer,
          useValue: { bypassSecurityTrustResourceUrl: (url: string) => url },
        },
      ],
    });

    fixture = TestBed.createComponent(AddressDisplayComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should select guids from the store', () => {
    fixture.detectChanges();
    component.guids$.subscribe((guids) => {
      expect(guids).toEqual(['123', '456']);
    });
  });
});
