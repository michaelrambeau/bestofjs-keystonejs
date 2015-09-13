var async = require('async')
var keystone = require('keystone')
var request = require("request")
 
var Superproject = keystone.list('Superproject');
var Tag = keystone.list('Tag');
var Snapshot = keystone.list('Snapshot');

require("coffee-script/register");
var github = require('../../batches/github.coffee');

var api = {};
 
/**
 * Return all project and tag list
 */
api.list = function (req, res) {
  var data = {};
  var getProjects = function (cb) {
    Superproject.model.find()
      .sort({
        stars: -1
      })
      .exec(function(err, docs) {
        if (err) throw err;
        data.projects = docs;
        cb(err, docs);
      });
  };
  var getTags = function (cb) {
    Tag.model
      .find()
      .sort({name: 1})
      .exec(function(err, docs) {
        if (err) throw err;
        data.tags = docs;
        cb(err, docs);
      });
  };
  async.parallel([getProjects, getTags], function (cb) {
    return res.json(data);
  });		

};

api.single = function (req, res) {
  var data = {
    project: {},
    snapshots: [],
    readme: ''
  };
  var id = req.params.id;
  console.log('Get data for a single project...', id);
  
  var getProject = function (cb) {
    Superproject.model.findOne({_id: id})
      .populate('tags')
      .exec(function (err, doc) {
        if (err) throw err;
        data.project = doc;
        getReadMe(doc, cb)
      });
  };
  var getSnapshots = function (cb) {
    Snapshot.model.find({project: id})
      .exec(function (err, docs) {
        if (err) throw err;
        data.snapshots = docs;
        cb();
      });
  };
  var getReadMe = function (project, cb) {
    github.getReadme(project, function (err, readme) {
      if (err) console.log(err);
      console.log(readme);
      var root = project.repository;
      
      //Replace relative URL by absolute URL
      var getImagePath = function (url) {
        var path = url;
        
        //If the URL is absolute (start with http), we do nothing...
        if (path.indexOf('http') === 0) return path;
        
        //Special case: in Faceboox Flux readme, relative URLs start with './'
        //so we just remove './' from the UL
        if (path.indexOf('./') === 0) path = path.replace(/.\//, '');
        
        //...otherwise we create an absolute URL to the "raw image
        // example: images in "You-Dont-Know-JS" repo.
        return root + '/raw/master/' + path;
      };
      readme = readme.replace(/src=\"(.+?)\"/gi, function(match, p1) { 
        return 'src="'+ getImagePath(p1) + '"'}
      );
      
      data.readme = err ? 'Unable to access README.' : readme;
      cb();      
    });
  }; 
  async.parallel([getProject, getSnapshots], function (cb) {
    return res.json(data);
  });	
};

module.exports = api;
