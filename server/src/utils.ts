import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import * as express from 'express';
import { find } from 'lodash';
import { IDocumentStore, IDocumentSession } from 'ravendb';

export interface Context {
  store: IDocumentStore;
  session: IDocumentSession;
  req: CustomRequest;
  res: express.Response;
}

export interface ICookieSession {
  id?: string;
  roles?: string[];
}

export interface CustomRequest extends express.Request {
  session: {
    user: ICookieSession;
    nowInMinutes: number;
  };
}
