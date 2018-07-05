# RavenDB and GraphQL Promise Issue

Install server dependencies

```
yarn
```

To start the server

```
yarn dev
```

Go to http://localhost:4000/playground and enter the code below, then press the round Play button in the middle to execute the calls.

```
query regionById {
  regionById(Id: "regions/1-A") {
    Name
  }
}

query regions {
  regions {
    Name
    Territories {
      Code
      Name
    }
  }
}
```

You should see the unhandled promise in the terminal window where you launched using 'yarn dev'

```
(node:52167) Warning: a promise was created in a handler at domain.js:101:23 but was not returned from it, see http://goo.gl/rRqMUw
    at Promise.then (/Users/Troy/Development/RavenDB/ravendb-graphql-troy/node_modules/bluebird/js/release/promise.js:125:17)
```
