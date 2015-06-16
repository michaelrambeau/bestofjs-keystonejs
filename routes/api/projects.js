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
    Tag.model.find().exec(function(err, docs) {
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
      data.readme = err ? 'Unable to access README.' : readme;
      cb();      
    });
  }; 
  var getReadMeOLD = function (project, cb) {
    var repoName = project.repository.substring(('https://github.com/').length);//"facebook/fixed-data-table"
    var url = 'https://api.github.com/repos/' + repoName + '/readme';
    url = url + "?" + process.env.GITHUB;
    var options = {
      url: url,
      headers: {
        'User-Agent': process.env.GITHUB_USERNAME      
      }
    };
    console.log('Get', options);
    request.get(options, function (error, response, body) {
      if (error) throw error;
      console.log('Github request', response.statusCode);
      if ( response.statusCode == 200) {
        var json = JSON.parse(body);
        var buffer = new Buffer(json.content, 'base64');
        data.readme = buffer.toString('utf8');
      }
      else {
        console.log(body);
      }
      cb();
    });
  };
  async.parallel([getProject, getSnapshots], function (cb) {
    return res.json(data);
  });	
};

module.exports = api;
