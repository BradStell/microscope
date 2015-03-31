/**
 * The helpers for the postItem template
 *
 */

Template.postItem.helpers({

    // Create an html anchor, set its href to the current posts url, return its hostname
	domain: function() {
		var a = document.createElement('a');
		a.href = this.url;
		return a.hostname;
	},

    // Check to see if the post belongs to the user
    ownPost: function() {
        return this.userId === Meteor.userId();
    },

    // Return the author of the post item
    author: function() {
        return this.author;
    }
});