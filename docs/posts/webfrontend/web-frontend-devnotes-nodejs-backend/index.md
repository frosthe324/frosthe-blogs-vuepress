---
title: Web Front-end Basics - Nodejs
date: 2020-03-10 09:21:58
description: Intro of Nodejs backend development
excerpt: Intro of Nodejs backend development
category:
  - WebFrontend
tag:
  - javascript
  - nodejs
  - backend
---

## How modules work behind the scenes

- In nodejs, every single file is treated as a `module`.
- Use `module.exports =` to specify the stuff to export from a module. `module` object is available to all nodejs modules.

NodeJs do the following phases to load a module:

- File path resolving: resolve the file from the path in `require` function
- Wrapping: wrap the user code in a IFIE function with following arguments:
  - `exports`: reference to `module.exports`, used to export object from a module.
  - `require`: function to require modules
  - `module`: reference to the current module object
  - `__filename`: absolute path of the file where the module is defined
  - `__dirname`: Absolute path of the directory where the module is defined
- Execution: Simply execute the IIFE function
- Returning Exports:
  - `require` function returns `exports` of the required module
  - `module.exports` is the returned object for `require` function
  - use `module.exports` when exporting only one single variable like class or function
  - use `exports.{XYZ}` to add as properties when exporting multiple named variables
- Caching: Cache the module after first time load it.

Nodejs engine:

- `v8 engine`: written in C++ and javascript
- `libuv`: Written in C++ event loop and thread pool

nodejs is a c++ process running in a single thread.

- Initialize program
- Execute "top-level" code
- Require modules
- Register event callbacks
- Start event loop

`libuv` provides the nodejs single thread a thread pool with multiple(4 or more) threads. The event loop can offload heavy work(IO operations like read/write files, cryptograpyh, hashing passwords, etc) from the event loop to the thread pool.

---

## Event loop

- All application codes that are inside callback functions will run in the event loop.
- Event-driven architecture: The event loop receive the events each time something happened and call the corresponding callback functions, offloads the heavy tasks to thread pool.
- Event loop has multiple phases, each phase has a callback queue:
  1. Expired timer callbacks
  2. I/O polling and callbacks
  3. setImmediate callbacks
  4. Close callbacks
  5. `Process.NextTick()` queue and other mircotasks queue will be processed right after each of the 4 phases

### Tricks

- It's usually a common better practice to use `__dirname`, it always translate to the directory in which the script that is currently executing is located. While `./` points to the working directory where the command is issued. `./` in `requie('./')` locates the directory where the current module is.
- `JSON.parse()` is a javascript built-in function to parse a json string value into a javascript object.
- `JSON.stringify()` is the method to convert a JSON object to string.
- `let error = {...err}` would only declared properties, not copying inherited properties.

---

## Streams

- Readable Streams
  - `pipe` method to fix backpressure problem. Like `readableStream.pipe(writeableDest)`

## Notes:

- `Object.assign()` is to merge 2 objects into 1.

## Environment Variables in Nodejs Development

`process` variable is a nodejs core module, and available everywhere in nodejs application. We can use `process.env` to access nodejs environment variables. There are multiple ways of setting these environment variables:

- terminal: specify `{ENV_NAME}= nodemon server.js` to set environment variables before the command of running a node application.
- configuration file: create a file named `config.env`, which is also by convention. Use `npm dotenv` module to connect the config file, like `dotenv.config({path: './config.env'})`

> `NODE_{variableName}` is by convention read by express

---

## Express

### Middlewares

Middlewares are used to handle:

- Parsing body
  - `express.json()`
- Logging
  - `morgan` middleware writes dev logs to the console
- Setting headers
- Routing

We use `express.use({function(req, res, next)})` to add a middleware into middleware stack, the function have 3 arguments:

- `request`
- `response`
- `next`: next middleware delegate. every middleware function(except the last one) must call the `next()` function, otherwise the pipeline will get stuck.

### Routing

Routes are actually middlewares mapped to certain urls.

- `app.get('/api/tours/:id')` to specify a `id` parameter
- `app.get('/api/tours/:id?')` to specify an optional `id` parameter
- `app.route('/api/tours').get()` defines a route.
- `app.post(middleware1, middleware2)` allows us to pass in multiple middlewares side by side, `middleware1` will first be executed before `middleware2`
- use `app.use(express.static({rootFolder}))` to serve static files.
- `app.all('*')` match all http methods with all routes, this is often used for undefined routes handler.

We use `express.Router()` to define a router middleware, and then use it for express apps:

```javascript
const toursRouter = express.Router();
toursRouter.route("/").get(getAllTours).post(createTour);

toursRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);
app.use("/api/v1/tours", toursRouter);
```

With `router.param('{param}', (req, res, next, val)=>{})` middleware, we can have AOP enabled with middlewares in express.

- By default, each router only has access to the parameters of its own routes, to enable router to have access to parameters of routes that belong to other router, we need to specify `express.router({ mergeParams: true })` when creating the router.

`npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev`

---

## MongoDB

- Collections -> Tables
- Documents -> Rows

Mongo shell commands:

- `use {DB_NAME}`: create new db if not existing, otherwise switch to the db.
- `show dbs`: list all databases
- `show collections`: list all collections of current db.
- `db.{COLLECTION_NAME}.insertOne({})`: insert one BSON document into `{COLLECTION_NAME}` of current db.
- `db.{COLLECTION_NAME}.insertMany([{}, {}])`: insert an array of BSON documents into `{COLLECTION_NAME}` of current db.
- `db.{COLLECTION_NAME}.find()`: list all BSON documents of `{COLLECTION_NAME}` in current db.
  - `find({ name: "XXX"})`: find documents that match the criteria
  - `find({ name: "XXX", price: {$lte: 500} })`: find documents match the name and price less than 500
  - `find({ $or [{price: {$lt: 500}}, {rating: {$gte: 4.8}}]})` find documents whose price is less than 500 or rating is greater than or equal to 4.8
- `db.{COLLECTION_NAME}.updateOne({name: "XXX"}, {$set: {price: 597}})`: update the first document match the name "XXX"
- `db.{COLLECTION_NAME}.updateMany({price: {$gt: 500}, rating: {$gte:4.8}}, {$set: {premium: true}})`: update all documents that match price > 500 and rating >= 4.8, adding a new field `premiun` to be true
- `db.{COLLECTION_NAME}.replaceOne()` and `db.{COLLECTION_NAME}.replaceMany()` to perform entire document replacement
- `db.{COLLECTION_NAME}.deleteOne()` and `db.{COLLECTION_NAME}.deleteMany()` to delete documents with same criteria pattern, `db.{COLLECTION_NAME}.replaceMany({})` is used to delete all documents without any filtering, be careful to use it.

---

## Mongoose

### Schema

`mongoose.Schema({})` returns a schema object:

```javascript
mongoose.Schema({
  name: {
    type: String,
    required: [true, "customized error message"],
    unique: [true, "customized error message"],
    trim: true, // trim spaces at both ends
    select: false, // exclude the field from querying
  },
});
```

### Model

`mongoose.model('Tour', {schemaObject})` return a blueprint of the data object, which is also responsible for perform database access operations like CRUD.

```javascript
coust Tour = mongoose.model('Tour', {schemaObject});
const numTours = Tour.countDocuments(); // return the amount of documents.
```

#### Virtual Properties

Virtual properties are fields that can be defined on the schema,but will not be persisted. They are often used for properties that can be easily converted from real properties.

```javascript
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
```

#### Query

Query object for filtering data before returning the data.

```javascript
const query1 = Model.find({}); // traditional way of querying data.
const query2 = Model.find(); // API way of querying data.
query.where('price').equal().lt()..
query.sort('price').('-createdAt'); // with "-" means to sort desc
query.sort('price duration') // sort by multiple fields is seperated by space
query.select('name description price duration') // project a subset of fields of one collection
query.select('-__v') // project a subset of fields exclude "__v" field
query.skip({amount}).limit({amont}) // used to do pagination
```

#### Aggregation Pipeline

Use `Model.aggregate([{}, {}])` to define aggregation pipelines.

```javascript
const stats = await Tour.aggregate([
  {
    $match: { ratingsAverage: { $gte: 4.5 } },
  },
  {
    $group: {
      _id: { $toUpper: "$difficulty" },
      numTours: { $sum: 1 },
      numRatings: { $sum: "$ratingsQuantity" },
      avgRating: { $avg: "$ratingsAverage" },
      avgPrice: { $avg: "$price" },
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" },
    },
  },
  {
    $sort: {
      avgPrice: 1,
    },
  },
  {
    $match: { _id: { $ne: "EASY" } },
  },
]);
```

### Mongoose Middleware

Like triggers in RDS, middlewares are executed at certain hooks, there 4 types of mongoose middleware:

- document middleware:
- query middleware:
- aggregate middleware:
- model middleware:

document middleware:

```javascript
// document middleware, runs before .save() and .create() command
tourSchema.pre("save", function (next) {
  console.log(this);
  next();
});
```

### Validation

NOTE: validator in `validate` attribute of mongoose schema, `this` keyword only works when executing `model.save() and model.create()`, it will not work when executing `model.update()` documents.

---

## Error handling in Nodejs Applications

use npm package `ndb` to be installed as dev dependency to debug a nodejs application.

Distinguish errors first:

- Operational Errors: Problems that we can predict will happen at some point, so we just need to handle them in advance. For example:
  - Invalid path accessed;
  - Invalid user input(validator error from mongoose)
  - Failed to connect to server;
  - Failed to connect to database;
  - Request timeout;
- Programming Errors: Bugs that developers introduce into our code. Difficult to find and handle. Foe example:

  - Reading properties on undefined;
  - Passing a number where an object is expected;
  - Using `await` without `async`;
  - Using `req.query` instead of `req.body`;

### Central error handling middleware

- `express` will assume anything we passed into `next()` method as an error, and skip all middlewares and jump to error handling middleware if there is one defined.
- Use `Error.captureStackTrace(this, this.constructor);` to capture stacktrace of a customized Error class.
- Remenber to `return next(err)` in express for error handling, otherwise it will continue to process the remaining codes.

### How developers should handle errors

- have different message sent to client per environment
- log all non-operational errors into logs
- recognise other types of error as operational errors and handle them, like errors thrown by express, mongoose:
  - invalid id error: CastError
  - duplicate error:
  - validation error
- errors outside `express`: unhandled promise rejections. We use `process.on('unhanldedRejection', function)` to register a global handler for unhandled rejections.
- catching uncaught exceptions:

---

## Security Summary

### Compromised Database

- Strongly encrypted passwords with salt and hash(bcrypt)
- Strongly encrypted password reset tokens(SHA256)

### Brute Forces Attacks

- Use `bcrypt`(make the login request really slow)
- Implement rate limiting(express-rate-limit): limits the number of requests coming from one single IP.
  - Status Code 429 for too many requests
- Implement maximum login attemps for each user.

### Cross-site Scripting Attack

- Store jwt in HTTPOnly cookies: Never ever store jwt in local storage. Instead, we should store jwt in an HTTPOnly cookie that makes it so the browsers can only receive and send the cookie but can not access it or modify it in any way.
  - A cookie is just a small piece of text that the server can send to the client. When the client receives the cookie, it will automatically store it and then automatically send it back along with all future requests to the server where it come from.
  - Use `res.cookie('jwt', {value}, {options-object})` to define how a cookie should be sent in `express`.
    - `expires` option: decides how long the browser will store it before deleting it.
    - `secure` option: if `true`, the cookie will only be sent in a encrypted connection.
    - `httpOnly` option: if `true`, the cookie can not be accessed or modified by the browser in any way.
- Sanitize user input data
- Set special HTTP headers(`helmet` package):

### Denial-Of-Service(DOS) Attacks

It happens when attackers send so many requests to a server that it breaks down and the application becomes unavailable

- Implement rate limiting(express-rate-limit): limits the number of requests coming from one single IP.
- Limit body payload(in body-parser): limits the amount of data that can be sent in a body of a post or a patch request.
- Avoid evil regular expressions: regular expressions that take an expotential time to run for non-matching inputs, they can bring the entire application down.

### NO-SQL Query Injection Attacks

It happens when an attacker instead of inputting valid data, injects some query in order to create query expressions that are gonna translated to true

- Use mongoose for MongoDB(because of SchemaTypes)
- Sanitize user input data
  - use `express-mongo-sanitize` npm package, which will look at the `req.body`, `req.query` and `req.params` to filter out all the `$` and `.`
  - use `xss-clean` npm package, which will clean any user input from HTML code.

### Other Best Practices and Suggestions

- Always use HTTPS
- Create random reset password tokens with expire dates
- Deny access to JWT after password change
- Don't commit sensitive config data to Git
- Don't send error details to clients
- Prevent Cross-site Request Forgery(csurf package)
- Require re-authentication before a high-value action
- Implement a blacklist of untrusted JWT
- Confirm user email address after first creating account
- Keep user logged in with refresh tokens
- Implement two factor authentication
- Prevent parameter pollution causing unhandled exceptions
  - use npm `hpp` package, which will clean up the query string for duplicate fields.

---

## Data Modelling

### Types of Relations

- 1:1: Movie -> Name
- 1:Many: based on relative amount of many, we have:
  - 1 to a few: 1 moive could win a few awards
  - 1 to many: 1 moive can have hundreds/thousands of reviews
  - 1 to a ton: 1 app could have millions of logs.
- Many:Many: 1 movie can have mutilple actors while 1 actor can play in many moives

We have multiple different referencing types:

- Child Referencing: Parent document holds an array of ids pointing to the documents, the child documents know nothing about its parent document. Best used in 1:few relationships.
- Parent Referencing: Child docuent holds the id of the parent document, the parent document knows nothing about its children. Best used in 1:Many and 1:Ton relationships.
- Two way Referencing: Combined with child and parent referencing. Best used in Many:Many relationships.

### Referencing vs. Embedding

Referencing/Normailized:

- Easier to query documents on its own.
- Need additional queries to get data from referenced document

Embedding/Denormalized:

- Able to get all data in one query
- Impossible to query the embedded documents on its won

When to reference and when to embed?

- Relationship Type: How 2 datasets are related to each other
- Data Access Pattern: How often data is read or written, read/write radio
- Data Closeness: How much data is related, how we want query data from db
