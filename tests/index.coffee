# Test using Tape librairy
# see https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4
#
# First test (2015/08/16): check API end point `/project/all`

tape = require 'tape'
{test} = tape
start = test
end = test

require('dotenv').load()
keystone = require( "keystone")


start 'Initialize Keystone', (t) ->
  t.comment 'Starting keystone...'
  startKeystone()
  t.comment 'Started!'
  t.pass('Keystone initialized.')
  t.end()


test 'API /projects', (t) ->

  api = require '../routes/api/projects'
  data = {}

  res = 
    json: (json) ->
      t.comment 'Get API response: ' + json.projects.length
      data = json 
      t.assert data.projects and data.projects.length, 'Should return projects'
      t.assert data.tags and data.tags.length, 'Should return tags'
      t.end()
      
  api.list null, res
  
test 'API /project/:id', (t) ->
  id = '5597e57541098c0300ca4a7d'
  api = require '../routes/api/projects'
  data = {}

  res = 
    json: (json) ->
      console.log json
      data = json
      t.ok data.project, 'Should return one project'
      t.assert data.project._id, id, 'project _id should match the URL parameter'
      t.ok data.readme, 'Should return readme data'
      t.ok data.readme.length, 'Readme length should not be empty.'
      t.end()
 
  req =
    params:
      id: id
  api.single req, res
  
  
end 'Close the db session', (t) ->
  # Don't forget to close the db connection, otherwise the test keeps hanging
  # despite the t.end() instruction, which makes the CI fails (timeout). 
  keystone.mongoose.disconnect()
  t.pass('db connection closed.')
  t.end()  
  
startKeystone = () ->
  console.log 'start Keystone'
  
  path = require( "path" )
  opts =
    models: "./models"
    cwd: process.cwd()
    keystone:
      headless: true
  opts.keystone[ "module root" ] = opts.cwd      
  
  keystone.init( opts.keystone )
  mongoUri = opts.mongoUri || process.env.MONGO_URI;
  console.log( "Connecting to mongoose URI:", mongoUri )
  keystone.mongoose.connect( mongoUri )
  console.log( "Importing models:", path.join( opts.keystone[ "module root" ], opts.models ) )
  keystone.import( opts.models )
  