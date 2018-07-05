import { IDocumentStore, DocumentStore } from 'ravendb';
import * as fs from 'fs';
import * as path from 'path';
import config from '../config';
import { Certificate } from 'crypto';
import models from './models';

export function initializeStore(): IDocumentStore {
  const { databaseName, databaseUrl } = config;
  let store = new DocumentStore(databaseUrl, databaseName);
  store.initialize();
  return store;
}
