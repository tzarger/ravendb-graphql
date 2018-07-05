// require('dotenv').config();

import * as path from 'path';
import * as fs from 'fs';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as cookieSession from 'cookie-session';
import { graphqlExpress } from 'apollo-server-express';

import { makeExecutableSchema } from 'graphql-tools';
import { initializeStore } from './db';
import expressPlayground from 'graphql-playground-middleware-express';
import resolvers from './resolvers';
import { CustomRequest } from './utils';

const app = express();
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(
  cookieSession({
    name: 'session',
    keys: ['CC5C6199CDE7832D55E7ED5E7CD53', 'AFF843F51BA55EE26F7D26C9F93A6'],
  })
);
app.use((req: CustomRequest, res, next) => {
  req.session.nowInMinutes = Math.floor(Date.now() / 60e3);
  next();
});
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

const store = initializeStore();

// Construct a schema, using GraphQL schema language
const typeDefs = fs.readFileSync(path.join(__dirname, process.env.NODE_ENV === 'production' ? '../schema.graphql' : '../../schema.graphql')).toString();
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

// Build per-request context and attach Raven session so resolvers can access it
const context = (req: CustomRequest, res: express.Response) => {
  const session = store.openSession();

  return {
    store,
    session,
    req,
    res,
  };
};

app.get('/api/test', async (req, res) => {
  console.log('start', new Date().getMilliseconds());
  const session = store.openSession();
  let regions = session.query({ collection: 'Regions' });
  regions.search('Name', `*South*`);
  const result = await regions.all();
  console.log('result', result.length);
  console.log('end', new Date().getMilliseconds());
  res.json(result);
});

app.use('/graphql', bodyParser.json(), graphqlExpress(async (req: CustomRequest, res) => ({ schema, context: context(req, res) })));

if (process.env.NODE_ENV !== 'production') {
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }));
}

console.log('env', process.env.NODE_ENV, process.env.PORT);

const port = process.env.PORT || 4000;

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(port, async () => {
  console.log(`Listening on port ${port}...`);
  console.log('All set, go to: http://localhost:4000/playground!');
});
