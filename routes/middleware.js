/**
 * This file contains the common middleware used by your routes.
 * 
 * Extend or replace these functions as your application requires.
 * 
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */

var _ = require('underscore');


/**
	Initialises the standard view locals
	
	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/

exports.initLocals = function(req, res, next) {
	
	var locals = res.locals;
	
	locals.navLinks = [
		{ label: 'Home',		key: 'home',		href: '/' }
	];
	
	locals.user = req.user;
	
	next();
	
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/

exports.flashMessages = function(req, res, next) {
	
	var flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	
	res.locals.messages = _.any(flashMessages, function(msgs) { return msgs.length; }) ? flashMessages : false;
	
	next();
	
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */

exports.requireUser = function(req, res, next) {
	
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
	
};

/**
	Prevents people from launching batches if the right key is not present inside request headers.
 */
exports.batchAccessControl = function(req, res, next) {
	var key = 'BATCH_KEY'
	var userKey = req.headers[key.toLowerCase()] || '';
	var configKey = process.env[key] || '';
	if (configKey == '') {
		res.status(400).json({error: '`' + key + '` must be set in the environment!'});
		return false;
	}	
	console.log('Checking batch access... configKey=`', configKey, '`, userKey=`', userKey, '`');
	var isAllowed = userKey === configKey;
	if (!isAllowed) {
		//Send an "401 Unauthorized" error if the keys do not match
		res.status(401).json({ error: 'Not allowed to launch batches!' })
	} else {
		next();
	}
	
};