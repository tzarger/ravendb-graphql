import * as moment from 'moment';

export interface ITerritory {
  Code: string;
  Name?: string;
}

export class Territory implements ITerritory {
  constructor(public Code: string, public Name: string) {}
}