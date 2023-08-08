import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import connection from './portfolio_dbConnection.js';
import bodyParser from 'body-parser';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001;
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Configure multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

/*  BLOG LEVEL GET/POST  */
app.get('/', (req, res) => {
res.sendFile(path.resolve(__dirname, '../index.html'));
});

app.post('/master_route', upload.array('blogPictures'), (req, res) => {
    const {action } = req.body;
    console.log("the action is "+action);
    switch (action) {
        case 'insert_blog':
            insertBlog(req, res);
            break;
        case 'get_blogs':
            get_Blogs(req, res);
            break;
        case 'get_blog_post':
            getBlogPost(req, res);
            break;
        case 'submit_contact':
            submitContact(req, res);
            break;
        default:
            res.status(400).json({ error: 'Invalid action' });
    }
});


function insertBlog(req, res) {
    const { blogTitle, blogTags, blogContent } = req.body;
    const blogPictures = req.files;
    const query = 'INSERT INTO portfolio.my_blog(blog_title, blog_tags, blog_content) VALUES (?, ?, ?)';
    connection.query(query, [blogTitle, blogTags, blogContent], (error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error inserting blog data' });
            return;
        }
        const blogId = results.insertId;
        if (blogPictures && blogPictures.length > 0) {
            const pictureQuery = 'INSERT INTO portfolio.my_blog_images (image_data, blog_id) VALUES (?, ?)';
            const insertPromises = blogPictures.map((file) => {
                const pictureData = file.buffer;

                return new Promise((resolve, reject) => {
                    connection.query(pictureQuery, [pictureData, blogId], (pictureError, pictureResults) => {
                        if (pictureError) {
                            reject(pictureError);
                            return;
                        }
                        const pictureId = pictureResults.insertId;
                        resolve(pictureId);
                    });
                });
            });
            Promise.all(insertPromises)
                .then((pictureIds) => {
                    res.status(200).json({ message: 'Blog data successfully inserted', blogId });
                })
                .catch((error) => {
                    res.status(500).json({ error: 'Error inserting picture data' });
                });
        } else {
            // Handle the success case for blog insertion when there are no pictures
            res.status(200).json({ message: 'Blog data successfully inserted', blogId });
        }
    });
}

function get_Blogs(req, res) {
    const source = req.body.source;
    console.log("the source is "+source);
    let query;
    const query_latest_blogs = 'SELECT b.blog_id, b.blog_title, b.blog_tags, p.image_data, p.id_my_blog_images from portfolio.my_blog AS b LEFT JOIN portfolio.my_blog_images as p on b.blog_id = p.blog_id ORDER BY b.blog_id DESC LIMIT 2';
    const query_all_blogs = 'SELECT b.blog_id, b.blog_title, b.blog_tags, p.image_data, p.id_my_blog_images from portfolio.my_blog AS b LEFT JOIN portfolio.my_blog_images as p on b.blog_id = p.blog_id ORDER BY b.blog_id DESC';

    if(source ==="mainpage"){
        query = query_latest_blogs;
    }
    else if(source ==="blogpage"){
        query = query_all_blogs;
    }
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json({error: 'Error fetching blog data'});
            return;
        }
        const blogsData = {};
        results.forEach((row) => {
            const {blog_id, blog_title,blog_tags, id_my_blog_images, image_data} = row;
            if (!blogsData[blog_id]) {
                blogsData[blog_id] = {
                    blog_id,
                    blog_title,
                    blog_tags,
                    pictures: []
                };
            }
            if (id_my_blog_images && image_data) {
                const base64ImageData = Buffer.from(image_data).toString('base64');
                blogsData[blog_id].pictures.push({id_my_blog_images, image_data:base64ImageData});
            }
        });
        const blogs = Object.values(blogsData);
        res.status(200).json(blogs);
    });
}

function getBlogPost(req, res) {
    const blog_id = parseInt(req.body.blog_id);
    const query = 'SELECT b.blog_id, b.blog_title, b.blog_tags, b.blog_content, p.image_data, p.id_my_blog_images FROM portfolio.my_blog AS b LEFT JOIN portfolio.my_blog_images AS p ON b.blog_id = p.blog_id WHERE b.blog_id = ? ORDER BY b.blog_id DESC';

    connection.query(query, [blog_id],(error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error fetching blog post data' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Blog post not found' });
            return;
        }

        const blogpostData = {};
        const row = results[0]; // Get the first row

        const blog_id = row.blog_id;
        const blog_title = row.blog_title;
        const blog_tags = row.blog_tags;
        const blog_content = row.blog_content;
        blogpostData[blog_id] = {
            blog_id,
            blog_title,
            blog_tags,
            blog_content,
            pictures: []
        };
        for (const row of results) {
            if (row.id_my_blog_images && row.image_data) {
                const base64ImageData = Buffer.from(row.image_data).toString('base64');
                blogpostData[blog_id].pictures.push({ id_my_blog_images: row.id_my_blog_images, image_data: base64ImageData });
            }
        }
        const blogs = Object.values(blogpostData);
        res.status(200).json(blogs);
    });
}

function submitContact(req, res) {
    const {name,email,message} = req.body.my_data;
    console.log("the name is "+name);
    const query = 'INSERT INTO portfolio.portfolio_contact (name,email,message) VALUES(?,?,?)';
    connection.query(query, [name,email,message],(error, results) => {
        if (error) {
            res.status(500).json({ error: 'Error inserting blog data' });
            return;
        }
        res.status(200).json({ success: true, message: 'Contact data inserted successfully' });
    });
}

// Start the server
app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

