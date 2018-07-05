import { Territory } from './Territory';

export interface IRegion {
  Id: string;
  Name: string;
  Territories: Territory[];
}

export class Region implements IRegion {
  constructor(public Id: string, public Name: string, public Territories: Territory[]) {}
}
