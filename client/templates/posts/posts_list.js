/**
 * Helpers for postsList template.
 *
 * Returns all posts subscribed to ordered by the date submitted in posts helper
 */

Template.postsList.helpers({
	posts: function() {
		return Posts.find({}, {sort: {submitted: -1}});
	}
});