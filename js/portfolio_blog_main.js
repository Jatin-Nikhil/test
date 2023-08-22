//This file contains code for all blogging related functionality
//This call will be made on the page load which fetches latest two blogs
export function fetch_blogs(){
    $.ajax({
        url: '/api/master_route',
        method: 'post',
        data: {
            action: 'get_blogs'
        },
        success: function (response) {
            console.log(response.data);
                blog_creation_main(response.data);
        },
        error: function (error) {
            console.error('Error getting the details:', error);
        },
    })
}
function blog_creation_main(blogs){
    const blogContainer = document.getElementById('blog__parent');

    blogs.forEach((blog) => {
        const blogDiv = document.createElement('div');
        blogDiv.className = 'blog-child';
        blogDiv.setAttribute('blog-id', blog.id);

        const text_div = document.createElement('div');
        text_div.className= 'blog_post_text_div';

        const titleElement = document.createElement('p');
        titleElement.className = 'blog-post-title';
        titleElement.textContent = blog.attributes.Title;
        text_div.appendChild(titleElement);

        const dateOfCreation = document.createElement('span');
        dateOfCreation.className = 'blog-post-date-of-creation';

        let date = blog.attributes.DateOfCreation.split('T')[0];
        dateOfCreation.textContent = date;
        text_div.appendChild(dateOfCreation);

        blogDiv.appendChild(text_div);
        blogContainer.appendChild(blogDiv);
    });

    $(".blog-child").click(function(){
       let blog_id = $(this).attr("blog-id");
        $.ajax({
            url: '/api/master_route',
            method: 'post',
            data: {
                action: 'get_blog_post',
                blog_id: blog_id
            },
            success: function (response) {
                blog_post_show(response.data);
            },
            error: function (error) {
                console.error('Error getting the details:', error);
            },
        })
    });
}

function blog_post_show(blog){
    tab_switch("function");
    //main div
    const blog_post_Container = document.getElementById('tab_blog_content_main');
    blog_post_Container.innerHTML ="";
        //header div
        const blog_post_header_div = document.createElement('div');
        blog_post_header_div.className = 'tab_blog_content_header';
            const title_element = document.createElement('h1');
            title_element.className = 'tab_blog_content_header_title';
            title_element.textContent=blog.attributes.Title;
        blog_post_header_div.appendChild(title_element);
    blog_post_Container.appendChild(blog_post_header_div);
        //nav div
        const blog_post_nav_div = document.createElement('div');
        blog_post_nav_div.className = 'tab_blog_content_nav';
            const category_element = document.createElement('p');
            category_element.className = 'tab_blog_content_nav_category';
            category_element.textContent=blog.attributes.category;
        blog_post_nav_div.appendChild(category_element);
    blog_post_Container.appendChild(blog_post_nav_div);
        //picture div
        if (blog.attributes.coverPicture) {
            const img_div = document.createElement('div');
            img_div.className= 'blog_cover_image_div';
            const imgElement = document.createElement('img');
            imgElement.className = 'blog-cover-image';
            imgElement.src = `http://localhost:1337${blog.attributes.coverPicture.data.attributes.url}`;
            imgElement.alt = 'Cover Picture';
        img_div.appendChild(imgElement);
    blog_post_Container.appendChild(img_div);
        }
        //main content div
        const blog_post_mainContent_div = document.createElement('div');
        blog_post_mainContent_div.className='tab_blog_content_mainContent';
            //making markdown instance and passing the content
            const main_content = blog.attributes.mainContent;
            const md = window.markdownit();
            const parsedHTML = md.render(main_content);
        blog_post_mainContent_div.innerHTML = parsedHTML;
    blog_post_Container.appendChild(blog_post_mainContent_div);
        //footer div
        const blog_post_footer_div = document.createElement('div');
        blog_post_footer_div.className='tab_blog_content_footer';
    blog_post_Container.appendChild(blog_post_footer_div);
}

$(".tab_switch").click(function () {
    tab_switch("button");
});

function tab_switch(source){
    if(source === "function"){
       $("#_blog").hide();
       $("#tab_blog").show();
    }
    else if(source === "button"){
        $("#_blog").show();
        $("#tab_blog").hide();
    }
}

