import { FormControl } from '@angular/forms';

export interface AddressForm {
  addressee: FormControl<string>;
  street1: FormControl<string>;
  street2: FormControl<string>;
  town: FormControl<string>;
  county: FormControl<string>;
  postcode: FormControl<string>;
}
