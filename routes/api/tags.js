var async = require('async')
var keystone = require('keystone')
var request = require("request")
var _ = require("underscore")
 
var Superproject = keystone.list('Superproject');
var Tag = keystone.list('Tag');
var Snapshot = keystone.list('Snapshot');

var api = {};

api.single = function (req,res) {
  
  var id = req.params.id;
  
  var data= {};

  console.log('Get tag data for', id);
  var getTag = function (cb) {
    Tag.model.findOne({_id: id})
      .populate('projects')
      .exec(function (err, doc) {
        if (err) throw err;
        data.tag = doc;
        cb();
      })
  };
  
  var getProjects = function (cb) {
    console.log('Searching for projects', id);
    Superproject.model.find({tags: id})
      //.populate('report')
      .sort({stars: -1})
      .exec(function (err, docs) {
        console.log(docs.length, ' projects found.')
        if (err) throw err;
        data.projects = docs;
        cb();
      });
  };
  
  async.parallel([getTag, getProjects], function (err, cb) {
    if (err) throw err;
    return res.json(data);
  });
}

module.exports = api;