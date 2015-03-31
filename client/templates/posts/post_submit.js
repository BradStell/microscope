/**
 * The events and helpers (future) methods for post_submit.html.
 */

Template.postSubmit.events({

	// Listening for a submit form event
	'submit form': function(e) {
		e.preventDefault();

		// use jquery to grab the text from the two text fields and create an object
		var post = {
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val()
		};

		// Call Meteor function 'postInsert' in 'lib/collections/posts.js'.
		// checks for duplicate url:
		//		* if duplicate it returns id of post
		// 		* if not duplicate, post is created and stored in mongodb
		Meteor.call('postInsert', post, function(error, result) {
			// display the error to the user and abort
			if (error)
				return alert(error.reason);

			if (result.postExists)
				alert('This link has already been posted');

			Router.go('postPage', {_id: result._id});
		});	
	}
});