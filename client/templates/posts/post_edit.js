/**
 * Created by brad on 3/29/15.
 */
Template.postEdit.events({

    'submit form': function(e) {
        e.preventDefault();

        // this holds the current information of the object being iterated over in the template {{yield}}
        // block created by the routs.js file, which swaps out templates in the {{yield}} spot
        var currentPostId = this._id;

        // user jquery to retrieve the new url and title from the html input fields created in
        // 'client/templates/post_edit.html' and store them in an object
        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };

        // Calls 'Meteor' function in 'lib/collections/posts.js'
        // The first param is the Meteor method to call, the params up to but not including the anonymous
        // callback function are the params sent into the Meteor.postEdit() function, sending in the new properties
        // to change, as well as the current post ID. Then a callback function will execute
        // when the Meteor function is done. The 'result' variable will contain information
        // returned from the Meteor method.
        Meteor.call('postEdit', postProperties, currentPostId, function(error, result) {
            // display the error to the user and abort
            if (error)
                return alert(error.reason);

            if (result.postExists)
                alert('This link has already been posted');

            Router.go('postPage', {_id: result._id});

        });
    },

    'click .delete': function(e) {
        e.preventDefault();

        if (confirm("Delete this post?")) {
            var currentPostId = this._id;
            Posts.remove(currentPostId);
            Router.go('postsList');
        }
    }

});
