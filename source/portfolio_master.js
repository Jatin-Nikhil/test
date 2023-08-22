import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import connection from './portfolio_dbConnection.js';
import bodyParser from 'body-parser';
import path from 'path';
import axios from 'axios'; // Import the axios library


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
    switch (action) {
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


function get_Blogs(req, res) {
    axios.get('http://localhost:1337/api/blogs/?populate=*')
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            console.error('Error fetching blog data:', error);
            res.status(500).json({ error: 'Error fetching blog data' });
        });
}


function getBlogPost(req, res) {
    const blog_id = parseInt(req.body.blog_id);
    const apiUrl = `http://localhost:1337/api/blogs/${blog_id}?populate=*`;
    axios.get(apiUrl)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            console.error('Error fetching blog data:', error);
            res.status(500).json({ error: 'Error fetching blog data' });
        });
}


function submitContact(req, res) {
    const {name,email,message} = req.body.my_data;
    const query = 'INSERT INTO portfolio_contact.portfolio_contact_table (name,email,message) VALUES(?,?,?)';
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

