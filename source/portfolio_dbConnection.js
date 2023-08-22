import mysql from 'mysql'

const connection = mysql.createConnection({
    host: 'portfolio-main.c8cxaisywgmx.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: '!Naruto2023',
    database: '',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

export default connection;

