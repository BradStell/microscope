/**
 * Created by brad on 3/29/15.
 */
Template.postEdit.events({

    'submit form': function(e) {
        e.preventDefault();

        var currentPostId = this._id;

        var postProperties = {
            url: $(e.target).find('[name=url]').val(),
            title: $(e.target).find('[name=title]').val()
        };

        var postWithSameLink = Posts.findOne({url: postProperties.url});
        if (postWithSameLink) {
            alert("Link already exists.");
            Router.go('postPage', {_id: postWithSameLink._id});
        } else {
            Posts.update(currentPostId, {$set: postProperties}, function (error) {
                if (error)
                //display the error to the user
                    alert(error.reason);
                else
                    Router.go('postPage', {_id: currentPostId});
            });
        }
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
