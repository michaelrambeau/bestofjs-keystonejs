var async = require('async');
var keystone = require('keystone');
var _ = require('underscore');

//Classses
var ProjectBatch = require("../../batches/ProjectBatch");
var CreateSnapshots = require("../../batches/include/CreateSnapshots");
var CreateSuperProjects = require("../../batches/include/CreateSuperProjects");
var CheckGithub = require("../../batches/include/CheckGithub");


//Using ProjectBatch prototype to "reopen" the class 
// and a method used by all http request handlers.
ProjectBatch.prototype.httpStart = function (req, res) {
  var options = getOptions(req);
  this.start(options, function (stats) {
    var result = {
      message: 'OK',
      statistics: stats,
      options: options
    };
    res.json(result);    
  });
};


var getOptions = function (req) {
  console.log(req.query);
  var defaultOptions = {
    parallelLimit: 10
  }
  //using `req.query` to read querystring parameters (and not req.params used for parameters URL /:param1/:param2)
  //Note: `undefined` is returned when the parameter is not set.
  var options = {
    parallelLimit: req.query.parallel || 10
  };
  return options;
};

var batches = {}; //exported object

batches.createSnapshots = function (req, res) {
  var batch = new CreateSnapshots(keystone);
  batch.httpStart(req, res);
};

batches.createSuperprojects = function (req, res) {
  var batch = new CreateSuperProjects(keystone);
  batch.httpStart(req, res);
};

batches.checkGithub = function (req, res) {
  var batch = new CheckGithub(keystone);
  batch.httpStart(req, res);
};

batches.simpleLoop = function (req, res) {
  var batch = new ProjectBatch('Test', keystone);
  batch.httpStart(req, res);
};

module.exports = batches