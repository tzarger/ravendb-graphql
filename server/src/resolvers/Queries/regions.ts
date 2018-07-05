import { Context } from '../../utils';
import { Region, IRegion } from '../../db/models/Region';

export const regionQueries = {
  async regionById(parent, args: { Id: string }, { session }: Context): Promise<IRegion> {
    return await session.load<Region>(args.Id);
  },

  async regions(parent, _, { session }: Context): Promise<IRegion[]> {
    return await session
      .query<Region>({ collection: 'Regions' })
      .orderBy('Name')
      .take(25)
      .skip(0)
      .all();
  },
};
