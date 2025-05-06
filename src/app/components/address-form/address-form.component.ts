import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AddressForm } from '../../types/form/AddressForm';
import { CommonModule } from '@angular/common';
import { AddressService } from '@shared-services/address-form.service';
import { PostcodeCheckerService } from '@shared-services/postcode-checker.service';
import { map, Observable, of, switchMap, timer } from 'rxjs';
import { HttpStatusCode } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { addGuid } from '@states/guid/guid.actions';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-address-form',
  imports: [
    CommonModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent {
  public addressId!: string;
  public addressForm: FormGroup<AddressForm> = new FormGroup<AddressForm>({
    addressee: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-zA-Z\s'-]+$/)],
    }),
    street1: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ],
    }),
    street2: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    town: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ],
    }),
    county: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(100)],
    }),
    postcode: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(10)],
      asyncValidators: [this.getPostCodeAsyncValidator()],
    }),
  });

  private get _name(): string {
    return this.addressForm.controls.addressee.value;
  }

  private get _street1(): string {
    return this.addressForm.controls.street1.value;
  }

  private get _street2(): string {
    return this.addressForm.controls.street2.value;
  }

  private get _town(): string {
    return this.addressForm.controls.town.value;
  }

  private get _county(): string {
    return this.addressForm.controls.county.value;
  }

  private get _postcode(): string {
    return this.addressForm.controls.postcode.value;
  }

  constructor(
    private _addressService: AddressService,
    private _postCodeService: PostcodeCheckerService,
    private _store: Store<{ addresses: string[] }>
  ) {}

  public submitAddress(): void {
    if (this.addressForm.invalid) {
      return;
    }

    this._addressService
      .createAddress(
        this._name,
        this._street1,
        this._street2,
        this._town,
        this._county,
        this._postcode
      )
      .subscribe((x) => {
        this.addressId = x.addressId;
        this._store.dispatch(addGuid({ guid: x.addressId }));
      });
  }

  private getPostCodeAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return timer(500).pipe(
        switchMap(() => this._postCodeService.lookup(control.value)),
        map((result) => {
          if (result.status === HttpStatusCode.Ok) {
            return null;
          }
          return { invalidPostcode: true };
        })
      );
    };
  }
}
