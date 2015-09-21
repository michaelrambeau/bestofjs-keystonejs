var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var options = {
	schema: {
		collection: 'Superproject'
	}
};
var Superproject = new keystone.List('Superproject', options);


Superproject.add({
	name: { type: Types.Text, required: true, index: true, initial: true },
	description: { type: Types.Textarea, required: false },
	url: { type: Types.Url, required: false },
	repository: { type: Types.Url, required: true, initial: true },
	createdAt: { type: Types.Date },
	updatedAt: { type: Types.Date },
	tags: { type: Types.Relationship, ref: 'Tag', many: true },
	stars: { type: Types.Number },
	deltas: { type: Types.NumberArray },
	delta1: { type: Types.Number }

});

Superproject.schema.methods.toString = function () {
	return "Superproject " + this.name + ' ' + this._id;
};

/**
 * Registration
 */

Superproject.defaultColumns = 'name, stars, delta1, tags, createdAt';
Superproject.register();
