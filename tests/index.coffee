# Test using Tape librairy
# see https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4
#
# First test (2015/08/16): check API end point `/project/all`

tape = require 'tape'
{test} = tape

require('dotenv').load()
keystone = require( "keystone")


test 'A passing test', (t) ->
  t.pass('This test will pass.')
  t.end()

test 'Assertions with tape.', (t) ->
  expected = 'something to test'
  actual = 'something to test'
  t.equal actual, expected, 'Given two mismatched values, .equal() should produce a nice bug report'
  t.end()
  

if true then test 'API', (t) ->
  t.comment 'Starting keystone...'
  startKeystone()
  t.comment 'Started!'
  api = require '../routes/api/projects'
  data = {}

  res = 
    json: (json) ->
      t.comment 'Get API response: ' + json.projects.length
      data = json 
      t.assert data.projects and data.projects.length, 'Should return projects'
      t.assert data.tags and data.tags.length, 'Should return tags'
      t.end()
      
      # Don't forget to close the db connection, otherwise the test keeps hanging
      # despite the t.end() instruction, which makes the CI fails (timeout). 
      keystone.mongoose.disconnect()      
  api.list null, res
  
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
  