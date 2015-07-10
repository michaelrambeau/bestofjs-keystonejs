# File used to launch batches from the command line (from sails root level)

# `coffee batches test` => runs the simple test
# `coffee batches snapshots` => create snapshots
# `coffee batches reports` => update/create reports

# To process only one project, add a project parameters:
# `coffee batches test --project 2` => only processed project whose id is 2.

reqmod = require( "require-module" )
require('dotenv').load()
path = require( "path" )

console.log 'start!'
opts =
  models: "./models"
  cwd: process.cwd()
  keystone:
    headless: true

opts.keystone[ "module root" ] = opts.cwd
console.log( "options:", opts )
console.log( "setting cwd:", opts.cwd )

keystone = reqmod( "keystone", process.cwd() )
keystone.init( opts.keystone )
mongoUri = opts.mongoUri || process.env.MONGO_URI;
console.log( "Connecting to mongoose URI:", mongoUri )
keystone.mongoose.connect( mongoUri )
console.log( "Importing models:", path.join( opts.keystone[ "module root" ], opts.models ) )
keystone.import( opts.models )

ProjectBatch = require "./batches/ProjectBatch"

#Batch #1: create all snapshots
CreateSnapshots = require "./batches/include/CreateSnapshots"

#Batch #2: create superprojects
CreateSuperProjects = require "./batches/include/CreateSuperProjects"

minimist = require 'minimist'
argv = minimist(process.argv.slice(2))
console.dir argv
key = argv._[0]
options =
  snapshot: argv.snapshot
  debug: argv.debug
if argv.project
  options.project =
    _id: argv.project    
  
console.log 'Command line argument', key, options

switch key
  when 'test'
    batch = new ProjectBatch('Test', keystone)  
  when 'snapshots'
    batch = new CreateSnapshots(keystone)
  when 'reports'
    batch = new CreateReports(keystone)
  when 'superprojects'
    batch = new CreateSuperProjects(keystone)
  when 'export'
    batch = new ExportProjects() 
  when 'correctSnapshots'
    batch = new SnapshotBatch()     
  else
    throw new Error 'Unknown key!'

#Launch the batch!
batch.start options, (stats) ->
  console.log '/// Batch terminated normally. /// ', stats