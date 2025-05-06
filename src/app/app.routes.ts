import { Routes } from '@angular/router';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { AddressDisplayComponent } from './components/address-display/address-display.component';

export const routes: Routes = [
  {
    path: 'add-address',
    title: 'Add Address',
    component: AddressFormComponent,
  },
  {
    path: 'read-address',
    title: 'View Address',
    component: AddressDisplayComponent,
  },
  {
    path: 'read-address/:addressId',
    title: 'View Address',
    component: AddressDisplayComponent,
  },
  { path: '', redirectTo: 'add-address', pathMatch: 'full' },
];
