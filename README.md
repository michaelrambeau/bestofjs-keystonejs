#bestof.js.org backend application

bestof.js.org backend application, built with [KeystoneJS](http://keystonejs.com/)

## What I did

### 2015-06

* Create models: project, tag, snapshot and superproject
* Create batches
* Create the API used by the front-end application 

### 2015-07

* Add `checkgithub` and `test` batches, used to check the batches logic without updating any data.
* Batch scheduler laucher using http requests, add a middleware for security in `/routes/middleware.js`

## API

* /project/all
* /project/:id
* /tag/:id

## Batches

* STEP1: Take Github snapshots
* STEP2: Create `superprojects` records, used by front-end application

Batches used for tests: 

* checkgithub: loop through all projects and access Github repository.
* test: a simple loop through all `projects` records.

### From the command line

STEP1: Take Github snapshots:

`coffee start-batch.coffee snapshots`

STEP2: Build superprojects records, used in the front-end application:

`coffee start-batch.coffee superprojects`

### From http POST requests

`/batches/snapshots`

`/batches/superprojects`

`/batches/checkgithub`

`/batches/test`

http requests must contain a `batch_key` header that matches the BATCH_KEY environment variable.

### Automatic launch

[Zappier](https://zapier.com/) is used to trigger the batch everyday at 06:00 AM, by sending a post request to the server.
