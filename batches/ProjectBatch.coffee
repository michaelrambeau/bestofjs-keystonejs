#Base class extended by every batch

#Keen = require 'keen-js'
_ = require 'underscore'
async = require 'async'


class ProjectBatch
 
  constructor: (@title = 'ProjectBatch skeleton', @keystone) ->
    console.log "---- New batch #{@title} ----"
    @stats = 
      created: 0
      updated: 0
      deleted: 0  
      error: 0
    
  initKeystone: (cb) -> 
    @Project = @keystone.list('Project').model
    @Snapshot = @keystone.list('Snapshot').model
    @SuperProject = @keystone.list('Superproject').model

    @debug = false

    @init () =>
      @startLoop () =>
        cb()
     

  initTracker: () ->
    @keen = new Keen
      projectId: process.env.KEEN_ID
      writeKey: process.env.KEEN_KEY
      
  track: (data) ->
    return
    @keen.addEvent @title, data, (err, res) ->
      if err then console.log 'Unable to track event', err
     
  #To be overriden: custom async. initialization    
  init: (cb) ->
    cb()
  
  start: (options, cb) ->
    defaultOptions = 
      debug: false
      project: {}
    @options = _.assign defaultOptions, options
    @initKeystone () =>
      cb @stats
    
  #start the batch!    
  startLoop: (cb) ->
    t0 = new Date()
    console.log "--- start the batch ----"
    @track
      msg: 'Start!'
    @Project.find(@options.project)
      .populate('tags')
      .populate('snapshots')
      .sort({createdAt: 1})
      .exec (err, projects) =>
        if err then throw err
        console.log projects.length, 'projects to process...'  
        async.each projects, @processProject.bind(this), () =>
          @stats.duration = (new Date() - t0) / 1000
          console.log '--- end! ---', @stats
          @track
            msg: 'End'
            stats: @stats
          cb()    
    
  
  #Method to be over-riden by child classes
  processProject: (project, cb) ->
    console.log 'Procesing', project.toString()
    cb()
    
module.exports = ProjectBatch    