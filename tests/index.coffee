# Test using Tape librairy
# see https://medium.com/javascript-scene/why-i-use-tape-instead-of-mocha-so-should-you-6aa105d8eaf4

tape = require 'tape'
{test} = tape



test 'A passing test', (assert) ->
  assert.pass('This test will pass.')
  assert.end()

test 'Assertions with tape.', (assert) ->
  expected = 'something to test'
  actual = 'something to test'
  assert.equal actual, expected, 'Given two mismatched values, .equal() should produce a nice bug report'
  assert.end()
  
test 'API', (assert) ->
  assert.plan 2
  assert.comment 'Starting keystone...'
  startKeystone()
  assert.comment 'Started!'
  api = require '../routes/api/projects'
  data = {}
  #  projects: [1]
  res = 
    json: (json) ->
      assert.comment 'Get API response'
      data = json 
      assert.equal (data.projects and data.projects.length > 0), true, 'Should return projects'
      assert.equal (data.tags and data.tags.length > 0), true, 'Should return tags'
      assert.end()
  api.list null, res
  
startKeystone = () ->
  console.log 'start Keystone'
  require('dotenv').load()
  path = require( "path" )
  opts =
    models: "./models"
    cwd: process.cwd()
    keystone:
      headless: true
  opts.keystone[ "module root" ] = opts.cwd      
  keystone = require( "keystone")
  keystone.init( opts.keystone )
  mongoUri = opts.mongoUri || process.env.MONGO_URI;
  console.log( "Connecting to mongoose URI:", mongoUri )
  keystone.mongoose.connect( mongoUri )
  console.log( "Importing models:", path.join( opts.keystone[ "module root" ], opts.models ) )
  keystone.import( opts.models )
  