const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use(express.json());

mongoose.connect("mongodb+srv://Cluster47754:n1IEc1k8js6mOs2F@cluster47754.xy0zkgy.mongodb.net/manga_track?retryWrites=true&w=majority&appName=Cluster47754")
.then(() => {
    console.log('Connected to MongoDB')
} )
.catch((error) => {
    console.error('Error connecting to MongoDB', error)
})

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
})

const User = mongoose.model('User', userSchema);

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if(!token) {
        return res.status(401).json({ error: 'Unauthorized'});
    }

    jwt.verify(token, 'secret', (err, decoded) => {
        if(err) {
            return res.status(401).json( { error: 'Unauthorized' } );
        }
        req.user = decoded;
        next();
    })
}

app.post('/api/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })

        console.log(User.username)

        await newUser.save();
        res.status(201).json( {message: 'User registered successfully' })

    } catch (error) {
        res.status(500).json({ error: 'Internal server error '});
    }
})


app.post('/api/login', async (req, res) => {
    try {
      // Check if the email exists
      const user = await User.findOne({ email: req.body.username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const token = jwt.sign({ email: user.email }, 'secret');
      res.status(200).json({ token: token, username: user.username });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.get('/api/user', verifyToken, async (req, res) => {
    try {
        const user = await User.findOne( {email: req.user.email })
        if(!user) {
            return res.status(404).json( {error: 'User not found'})
        }
        res.status(200).json({ username: user.username, email: user.email });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})


app.get("/api/releases", async (req, res) => {
    try{
        const response = await axios.get("https://jsonblob.com/api/jsonBlob/1347844549984313344");
        res.json(response.data);

    }catch{
        res.status(500).json({error: "Failed to fetch data"});
    }
})


app.post("/api/search", async (req, res) =>{
    try{

        const searchQuery = req.body.search;
        const pageQuery = req.body.page;

        const exclude_genreQuery = ["Doujinshi", "Hentai", "Adult", "Shounen Ai", "Yaoi", "Smut", "Yuri"];

        let data = JSON.stringify({
            "search": searchQuery,
            "page": pageQuery,
            "exclude_genre": exclude_genreQuery
        })

        console.log(exclude_genreQuery);

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.mangaupdates.com/v1/series/search',
            headers: { 
                'Content-Type': 'application/json'
            },

            data : data
        }

        const response = await axios.request(config);
        console.log(response.data);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({error: "Failed to fetch data"})
    }
})

app.get("/api/series/:id", async (req, res) => {
    try {
        const mangaID = req.params.id;

        if (!mangaID) {
            return res.status(400).json({ error: "Manga ID is required" });
        }

        console.log("Fetching data for manga ID:", mangaID);

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.mangaupdates.com/v1/series/${mangaID}`,
            headers: {}
        };

        const response = await axios.request(config);
        res.json(response.data);

        //localStorage.setItem('mangaInfo', response.data)

        //res.sendFile(path.join(__dirname, "/manga-info.html"));

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
})


app.get("/series/:id", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manga-info.html'));
})



app.listen(port, () => console.log(`Server running on port ${port}`))


//db user
//db password hse5wPMJHEhJucNt

//mongodb+srv://Cluster47754:<db_password>@cluster47754.xy0zkgy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster47754

// const { MongoClient } = require("mongodb")

// const uri = "mongodb+srv://Cluster47754:n1IEc1k8js6mOs2F@cluster47754.xy0zkgy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster47754"

// const client = new MongoClient(uri);
// async function run() {
//   try {
//     const database = client.db('sample_mflix');
//     const movies = database.collection('movies');
//     // Query for a movie that has the title 'Back to the Future'
//     const query = { title: 'Back to the Future' };
//     const movie = await movies.findOne(query);
//     console.log(movie);
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);