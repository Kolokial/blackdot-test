import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AddressService } from '@shared-services/address-form.service';
import { PostcodeCheckerService } from '@shared-services/postcode-checker.service';
import { addGuid } from '@states/guid/guid.actions';
import { of } from 'rxjs';
import { AddressFormComponent } from './address-form.component';

describe('AddressFormComponent', () => {
  let component: AddressFormComponent;
  let fixture: ComponentFixture<AddressFormComponent>;
  let addressServiceSpy: jasmine.SpyObj<AddressService>;
  let postcodeServiceSpy: jasmine.SpyObj<PostcodeCheckerService>;
  let storeSpy: jasmine.SpyObj<Store>;

  beforeEach(async () => {
    addressServiceSpy = jasmine.createSpyObj('AddressService', [
      'createAddress',
      'readAddress',
    ]);
    postcodeServiceSpy = jasmine.createSpyObj('PostcodeCheckerService', [
      'lookup',
    ]);
    storeSpy = jasmine.createSpyObj('Store', ['dispatch']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule, AddressFormComponent],
      providers: [
        { provide: AddressService, useValue: addressServiceSpy },
        { provide: PostcodeCheckerService, useValue: postcodeServiceSpy },
        { provide: Store, useValue: storeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the form with initial values', () => {
    expect(component.addressForm).toBeTruthy();
    expect(component.addressForm.controls.addressee.value).toBe('');
  });

  it('should not submit when the form is invalid', () => {
    component.submitAddress();
    expect(addressServiceSpy.createAddress).not.toHaveBeenCalled();
  });

  it('should call createAddress and dispatch on valid submit', () => {
    const address = {
      addressee: 'Alice',
      street1: '123 Street',
      street2: '',
      town: 'Testville',
      county: 'Countyshire',
      postcode: 'W1A 1AA',
    };
    component.addressForm.setValue({
      addressee: 'Alice',
      street1: '123 Street',
      street2: '',
      town: 'Testville',
      county: 'Countyshire',
      postcode: 'W1A 1AA',
    });

    const mockResponse = of({ addressId: 'abc-123', ...address });
    addressServiceSpy.createAddress.and.returnValue(mockResponse);

    component.submitAddress();

    expect(addressServiceSpy.createAddress).toHaveBeenCalled();
    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      addGuid({ guid: 'abc-123' })
    );
  });
});
