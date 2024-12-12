export interface LocationFormData {
  id?: string;
  facility_name: string;
  physical_address: string;
  physical_city: string;
  physical_state: string;
  physical_zip: string;
  physical_country: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  primary_contact_id: string;
}

export interface Location {
  id: string;
  facility_name: string;
  physical_address: string;
  physical_city: string;
  physical_state: string;
  physical_zip: string;
  physical_country: string;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
  shipping_country: string | null;
  primary_contact_id: string | null;
  primary_contact: {
    profile: {
      first_name: string;
      last_name: string;
    };
  } | null;
}