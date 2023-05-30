export interface Brewery {
  id?: string;
  name: string;
  brewery_type?: string;
  address_1?: string | null;
  address_2?: string | null;
  address_3?: string | null;
  city?: string | null;
  state_province?: string | null;
  postal_code?: string | null;
  country?: string;
  longitude?: string;
  latitude?: string;
  phone?: string | null;
  website_url?: string | null;
  state?: string | null;
  street?: string | null;
}

export type RandomBreweryResponse = [Brewery];
