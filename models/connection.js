const mongoose = require('mongoose');

const connectionString = process.env.CONNECT_STR;

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
	.then(() => console.log('Database connected'))
	.catch(error => console.error(error));