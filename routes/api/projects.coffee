async = require('async')
keystone = require('keystone')
 
Project = keystone.list('Project')
 
/**
 * List Posts
 */
exports.all = (req, res) ->
	Project.model.find (err, items) ->
		
		if err then return res.apiError('database error', err)
		
		res.apiResponse
			projects: items