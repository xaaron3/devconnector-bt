const express = require('express');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// DB config
const db = require('./config/keys').mongoURI;

// connect to mongodb
mongoose
   .connect(
      db,
      { useMongoClient: true }
   )
   .then(() => console.log("MongoDB Connected"))
   .catch(err => console.log(err));
// had to add in useMongoClient and mongoose.Promise to remove deprecation warnings.

app.get('/', (req, res) => res.send('hello! world'));

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server iz running on port ${port}`));