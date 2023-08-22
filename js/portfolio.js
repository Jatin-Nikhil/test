import '../styles/modern-normalize.css'
import '../styles/portfolio.css'
import '../styles/components/header.css'
import '../styles/components/hero.css'
import '../styles/components/blobs.css'
import '../styles/components/about.css'
import '../styles/components/work.css'
import '../styles/components/work_sub.css'
import '../styles/components/blog.css'
import '../styles/components/contact.css'
import '../styles/components/footer.css'
import '../styles/utils.css'
import './utils.js'

$ (document).ready(function () {

//==================== CONTACT JS ====================
    $("#contact_form_btn").click(function() {
        let name = $("#name").val();
        let email = $("#email").val();
        let message = $("#message").val();

        if (name === "" || email === "" || message === "") {
            // Show inline validation error messages
            if (name === "") $("#name").css('border','1px solid red');
            if (email === "") $("#email").css('border','1px solid red');
            if (message === "") $("#message").css('border','1px solid red');
            return;
        }
        $("#name").css('border','none');
        $("#email").css('border','none');
        $("#message").css('border','none');

        $(this).html('<i class="fas fa-spinner fa-spin"></i> Loading...');
        const data = { name, email, message };

        $.ajax({
            url: '/api/master_route',
            method: 'post',
            data: {
                action: 'submit_contact',
                my_data: data
            },
            success: function(response) {
                $("#contact_form_btn").html('<i class="fas fa-check"></i> Submitted');
                clear_contact();
                setTimeout(function() {
                    $("#contact_form_btn").html('Submit');
                }, 2000);
            },
            error: function(error) {
                console.error('Error submitting the details:', error);
                $("#contact_form_btn").html('Submit');
            },
        });
    });

    //This clears the contact form after post submission
    function clear_contact() {
        $(".contact_form_input, .contact_form_textarea").val('');
    }

    //==================== WORK JS ====================
    $(".work__div_child").click(function(){
        const work_id = $(this).attr('data-attribute');
       if(work_id === 'portfolio'){
           window.open("../work_portfolio.html", '_blank');
       }
    });

});



