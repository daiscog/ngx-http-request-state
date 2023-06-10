export interface Beer {
  id: string;
  name: string;
  description: string;
}

export interface Brews {
  before: Beer[];
  after: Beer[];
}
