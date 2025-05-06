import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReadAddressResponse } from '@internal-types/api/ReadAddress';
import { AddressService } from '@shared-services/address-form.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { filter, map, Observable, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { selectAllGuids } from '@states/guid/guid.selectors';
import { AppState } from '@states/guid/guid.state';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

interface Address {
  addressId: string;
  name: string;
  street1: string;
  street2: string;
  town: string;
  county: string;
  postcode: string;
}

@Component({
  selector: 'app-address-display',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './address-display.component.html',
  styleUrl: './address-display.component.scss',
})
export class AddressDisplayComponent {
  private readonly _route = inject(ActivatedRoute);

  public addressListForm = new FormGroup({
    guidControl: new FormControl<string>(''),
  });

  public displayedAddress!: Address;

  public googleMapsUrl!: SafeUrl;
  public guids$!: Observable<string[]>;

  constructor(
    private _addressService: AddressService,
    private sanitizer: DomSanitizer,
    private store: Store<AppState>
  ) {
    this.guids$ = this.store.select(selectAllGuids);
  }

  ngOnInit() {
    this.subscribeToGuidObservable(
      this.addressListForm.controls.guidControl.valueChanges.pipe(
        filter((guid) => guid !== null)
      )
    );

    this.subscribeToGuidObservable(
      this._route.paramMap.pipe(
        map((params) => params.get('addressId') as string),
        filter((addressId) => addressId != null)
      )
    );
  }

  private subscribeToGuidObservable(guidObservable: Observable<string>): void {
    guidObservable
      .pipe(
        switchMap((addressId: string) =>
          this._addressService.readAddress(addressId)
        )
      )
      .subscribe((address: ReadAddressResponse) => {
        this.displayedAddress = {
          addressId: address.addressId,
          name: address.addressee,
          street1: address.street1,
          street2: address.street2,
          town: address.town,
          county: address.county,
          postcode: address.postcode,
        };

        this.buildGoogleMapsUrl(
          this.displayedAddress.street1,
          this.displayedAddress.street2,
          this.displayedAddress.town,
          this.displayedAddress.county,
          this.displayedAddress.postcode
        );
      });
  }

  private buildGoogleMapsUrl(
    street1: string,
    street2: string,
    town: string,
    county: string,
    postcode: string
  ) {
    const url = 'https://www.google.com/maps/place/';

    this.googleMapsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      encodeURI(`${url}+${street1}+${street2}+${town}+${county}+${postcode}`)
    );
  }
}
