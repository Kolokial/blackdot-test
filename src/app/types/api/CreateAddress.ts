export interface CreateAddressResponse {
  addressId: string;
  addressee: string;
  street1: string;
  street2: string;
  town: string;
  county: string;
  postcode: string;
}

export interface CreateAddressRequest {
  addressee: string;
  street1: string;
  street2: string;
  town: string;
  county: string;
  postcode: string;
}
