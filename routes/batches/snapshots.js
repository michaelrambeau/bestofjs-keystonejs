var async = require('async');
var keystone = require('keystone');
var ProjectBatch = require("../../batches/ProjectBatch");
var CreateSnapshots = require("../../batches/include/CreateSnapshots");
var CreateSuperProjects = require("../../batches/include/CreateSuperProjects");
var CheckGithub = require("../../batches/include/CheckGithub");

var batches = {};

batches.createSnapshots = function (req, res) {
  var batch = new CreateSnapshots(keystone);
  var options = {};
  batch.start(options, function (stats) {
    var result = {
      message: 'OK',
      statistics: stats
    };
    res.json(result);    
  });

};

batches.createSuperprojects = function (req, res) {
  var batch = new CreateSuperProjects(keystone);
  var options = {};
  batch.start(options, function (stats) {
    var result = {
      message: 'OK',
      statistics: stats
    };
    res.json(result);    
  });

};

batches.checkGithub = function (req, res) {
  var batch = new CheckGithub(keystone);
  var options = {};
  batch.start(options, function (stats) {
    var result = {
      message: 'OK',
      statistics: stats
    };
    res.json(result);    
  });

};

batches.simpleLoop = function (req, res) {
  var batch = new ProjectBatch('Test', keystone);
  var options = {};
  batch.start(options, function (stats) {
    var result = {
      message: 'OK',
      statistics: stats
    };
    res.json(result);    
  });

};

module.exports = batches