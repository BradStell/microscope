Posts = new Mongo.Collection('posts');

Posts.allow({
    update: function(userId, post) {
        return ownsDocument(userId, post);
    },
    remove: function(userId, post) {
        return ownsDocument(userId, post);
    }
});

Posts.deny({
    update: function(userId, post, fieldNames) {
        // may only edit the following two fields:
        return (_.without(fieldNames, 'url', 'title').length > 0);
    }
});

Meteor.methods({
	postInsert: function(postAttributes) {
		check(Meteor.userId(), String);
		check(postAttributes, {
			title: String,
			url: String
		});

		var postWithSameLink = Posts.findOne({url: postAttributes.url});
		if (postWithSameLink) {
			return {
				postExists: true,
				_id: postWithSameLink._id
			}
		}

		var user = Meteor.user();
		var post = _.extend(postAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date()
		});

		var postId = Posts.insert(post);

		return {
			_id: postId
		};
	},

    // postEdit Meteor method
    // function recieves the new attributes to be changed as well as the current post Id
    postEdit: function(attributesToEdit, postId) {

        // Check in our mongo db and see if a post with the same url exists or not.
        // If the same url does exist, make sure it is not the same post that is currently
        // being edited (in case a user clicks edit and then clicks submit without changing the url).
        var postWithSameLink = Posts.findOne({url: attributesToEdit.url});
        if (postWithSameLink && postWithSameLink._id != postId) {
            return {
                postExists: true,
                _id: postWithSameLink._id
            }
        }

        // User "underscore's" _.extend() method to add attributes to currently existing objects
        var post = _.extend(attributesToEdit, {
            updated: new Date()
        });

        // Update the mongo db item that corresponds to the postId.
        // the '$set' mongo attribute will set only the specified elements and not the others.
        Posts.update(postId, {$set: attributesToEdit}, function(error) {
            if (error)
                //display the error to the user
                alert(error.reason);
        });

        // Return back to the 'respons' object the _id of the current post, so the router can
        // route to its page.
        return {
            _id: postId
        }
    }
});