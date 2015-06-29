#bestof.js.org backend application

bestof.js.org backend application, built with  [KeystoneJS](http://keystonejs.com/)

## What I did

* Create models: project, tag, snapshot and superproject
* Create batches
* Create the API used by the front-end application 

## API

* /project/all
* /project/:id
* /tag/:id


## How to launch batches

Take Github snapshots:

`coffee start-batch.coffee snapshots`

Build superprojects records, used in the front-end application:

`coffee start-batch.coffee superprojects`