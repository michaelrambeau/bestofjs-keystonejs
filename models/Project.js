var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var options = {
  schema: {
  	collection: 'project'
  },
  defaultSort: '-createdAt',
  track: true
};
var Project = new keystone.List('Project', options);


Project.add({
	name: { type: Types.Text, required: true, index: true, initial: true },
	description: { type: Types.Textarea, required: false },
	url: { type: Types.Url, required: false },
	repository: { type: Types.Url, required: true, initial: true },
	createdAt: { type: Types.Date, default: Date.now },
	updatedAt: { type: Types.Date },
	tags: { type: Types.Relationship, ref: 'Tag', many: true }
	//snapshots: { type: Types.Relationship, ref: 'Snapshot', many: true }
});

Project.schema.methods.toString = function () {
	return "Project " + this.name + ' ' + this._id;
};

/**
 * Registration
 */

Project.defaultColumns = 'name, url, repository, tags, createdAt';
Project.register();
