
import '../styles/portfolio_blog_input_style.css'

$(document).ready(function() {
    $('#submit').on('click', function(event) {
        event.preventDefault();
        let blogTitle = $('#blog-title').val();
        let blogTags = $('#blog-tags').val();
        let blogContent = $('#blog-content').val();
        let blogPictures = $('#blog-pictures')[0].files;

        let formData = new FormData();
        formData.append('blogTitle', blogTitle);
        formData.append('blogTags', blogTags);
        formData.append('blogContent', blogContent);
        formData.append('action','insert_blog');
        for (let i = 0; i < blogPictures.length; i++) {
            formData.append('blogPictures', blogPictures[i]);
        }
        $.ajax({
            url: 'http://localhost:3001/master_route',
            method: 'post',
            data:formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log(response);
                $("#blog_data")[0].reset();
                let message = "Successfully submitted the post";
                post_message(message, 'var(--success');
            },
            error: function(error) {
                console.error('Error submitting form:', error);
                let message = "Error Submitting the post";
                post_message(message, 'var(--error)');
            },
        });
    });

    function post_message(message, color){
        let messageElement = $('.post_message');
        messageElement.css('visibility', 'visible');
        $(".post_message__body").text(message);
        messageElement.css("background-color",color );
    }

    $("#post_message__close").click(function(){
       let parent = $(this).parent().parent();
       parent.css('visibility', 'hidden');
    });
});
