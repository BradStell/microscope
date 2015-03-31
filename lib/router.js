/**
 * Routing code for our application
 *
 * ~~ by default, a router will look for a template that matches the routes name
 */

// Configure code (setup code)
//	* render the 'layout' template as our standard starting template
//	* render the 'loading' template for our standard loading page
//	* render the 'notFound' template if route is not found
//	* wait for the function to retrieve all posts before rendering anything
Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'notFound',
	waitOn: function() { return Meteor.subscribe('posts'); }
});

// The homepage route, render postsList template
Router.route('/', {
	name: 'postsList'
});

// The 'details' page. render the postPage template
// set the data context to the current post document
Router.route('/posts/:_id', {
	name: 'postPage',
	data: function() { return Posts.findOne(this.params._id); }
});

// The route for the postEdit template
// set the data context to the current post document
Router.route('/posts/:_id/edit', {
   name: 'postEdit',
    data: function() { return Posts.findOne(this.params._id); }
});

// Router for the postSubmit template
Router.route('/submit', {
	name: 'postSubmit'
});

// Check to see if the user is logged in or not.
// If there is no user, check to see if they are currently logging in, if so then render the loading template (prevents a data not found page on slow login)
// if they are not logging in render the accessDenied template
// If there is a user logged in then call the next() method on **something**
var requireLogin = function() {
	if (! Meteor.user()) {
		if (Meteor.loggingIn()) {
			this.render(this.loadingTemplate);
		} else {
			this.render('accessDenied');
		}
	} else {
		this.next();
	}
}

// Check to see if the currently logged in user owns the currently viewed post
// Gets called when the user tries to access postEdit route.
// If they do not have edit access rights to the current post, show accessDenied template
var ownsPost = function() {
	var post = Posts.findOne(this.params._id);

	if (Meteor.userId() === post.userId) {
		this.next();
	} else {
		this.render('accessDenied');
	}
}

// Router 'hooks', run this code before every route
// 	* if the user accesses postPage without a real document, render dataNotFound template?? (really notFound, not sure whats going on here)
//	* if the user navigates to postEdit route, make sure they own the post. (Even if they try to hard code '/edit' onto the end of the url
Router.onBeforeAction('dataNotFound', {only: 'postPage'});
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
Router.onBeforeAction(ownsPost, {only: 'postEdit'});
