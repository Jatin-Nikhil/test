//This file contains code for all blogging related functionality
//This call will be made on the page load which fetches latest two blogs
export function fetch_blogs(source){
    $.ajax({
        url: '/api/master_route',
        method: 'post',
        data: {
            action: 'get_blogs',
            source: source,
        },
        success: function (response) {
            if (source ==='mainpage'){
                blog_creation_main(response);
            }
            else if (source ==="blogpage"){
                blog_creation_blog(response);
            }
        },
        error: function (error) {
            console.error('Error getting the details:', error);
        },
    })
}
//This gets the latest blogs and appends to the main page blog sec
function blog_creation_main(data){
    const blogContainer = document.getElementById('blog__parent');
    data.forEach((blog) => {
        const blogDiv = document.createElement('div');
        blogDiv.className = 'blog-post';
        if (blog.pictures.length > 0) {
            const picturesDiv = document.createElement('div');
            picturesDiv.className = 'blog-post-picture-body';
            const firstPicture = blog.pictures[0]; // Get the first picture from the array
            const pictureElement = document.createElement('img');
            pictureElement.src = 'data:image/jpeg;base64,' + firstPicture.image_data;
            pictureElement.className = 'blog-post-pictures';
            picturesDiv.appendChild(pictureElement);
            blogDiv.appendChild(picturesDiv);
        }
        const anchor_tag = document.createElement('a');
        anchor_tag.className = 'blog-post-anchor-tag';
        anchor_tag.href ='/blog.html';
        const titleElement = document.createElement('h2');
        titleElement.className = 'blog-post-title';
        titleElement.textContent = blog.blog_title;
        anchor_tag.appendChild(titleElement);
        blogDiv.appendChild(anchor_tag);
        blogContainer.appendChild(blogDiv);
    });
}


//===========This sec is for the blog.html============//
function blog_creation_blog(blog_data){
    const blogContainer = document.getElementById('blog_main__parent_div');
    blog_data.forEach((blog_content) => {
        const blogDiv = document.createElement('div');
        blogDiv.className = 'blog_main__parent_post';
        if (blog_content.pictures.length > 0) {
            const firstPicture = blog_content.pictures[0];
            const pictureElement = document.createElement('img');
            pictureElement.src = 'data:image/jpeg;base64,' + firstPicture.image_data;
            pictureElement.className = 'blog_main__parent_post_pictures';
            blogDiv.appendChild(pictureElement);
        }
        const text_div = document.createElement('div');
        text_div.className = 'blog_main__parent_text_div';
        const titleElement = document.createElement('h2');
        titleElement.className = 'blog_main__parent_title';
        titleElement.textContent = blog_content.blog_title;
        text_div.appendChild(titleElement);
        const tag_element = document.createElement('h6');
        tag_element.className = 'blog_main__parent_tags';
        tag_element.textContent = blog_content.blog_tags;
        text_div.appendChild(tag_element);
        blogDiv.appendChild(text_div);
        blogContainer.appendChild(blogDiv);
    });
}


//This fetches that specific latest blog content when clicked from the main page
function fetch_blog_post(blog_id){
    $.ajax({
        url: '/api/master_route',
        method: 'post',
        data:{
            action:'get_blog_post',
            blog_id: blog_id
        },
        success: function(response) {
            console.log(response);
            show_blogPost(response[0]);
        },
        error: function(error) {
            console.error('Error getting the details:', error);
        },
    })
}

//This displays the above fetched blog content to a blog modal
function show_blogPost(data){
    const blog_post_modal = document.querySelector('.blog_post_modal');
    const blog_post_modal_content = document.querySelector('.blog_post_modal_content');
    blog_post_modal_content.innerHTML = '';
    const blogDiv = document.createElement('div');
    blogDiv.className = 'blog-post-modal-body';

    if (data.pictures.length > 0) {
        const blog_post_modal_picturesDiv = document.createElement('div');
        blog_post_modal_picturesDiv.className = 'blog-modal-header-pic';
        const firstPicture = data.pictures[0]; // Get the first picture from the array
        const pictureElement = document.createElement('img');
        pictureElement.src = 'data:image/jpeg;base64,' + firstPicture.image_data;
        pictureElement.className = 'blog-modal-post-pictures';
        blog_post_modal_picturesDiv.appendChild(pictureElement);
        blogDiv.appendChild(blog_post_modal_picturesDiv);
    }
    const title = document.createElement('h2');
    title.className = 'blog-post-modal-title';
    title.textContent = data.blog_title;
    blogDiv.appendChild(title);
    const tags = document.createElement('code');
    tags.className = 'blog-post-tags'
    tags.textContent = data.blog_tags;
    blogDiv.appendChild(tags);
    if (data.blog_content) {
        const contentElement = document.createElement('div');
        const lines = data.blog_content.split('\n');
        let parsedContent = '';
        for (const line of lines) {
            if (line.startsWith('#')) {
                parsedContent += `<h2 class="blog-post-subhead-2">${line.substring(1)}</h2>`;
            } else if (line.startsWith('##')) {
                parsedContent += `<h3 class="blog-post-subhead-3">${line.substring(2)}</h3>`;
            } else {
                parsedContent += `<p class="blog-post-para">${line}</p>`;
            }
        }
        contentElement.innerHTML = parsedContent;
        blogDiv.appendChild(contentElement);
    }
    blog_post_modal_content.appendChild(blogDiv);
    blog_post_modal.style.display = 'block';
}
$("#close_modal").click(function(){
    $(this).parent().hide();
});