const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { off } = require('process');

require('dotenv').config({ path: './config.env' });

const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log('Connected to MongoDB')
} )
.catch((error) => {
    console.error('Error connecting to MongoDB', error)
})

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    library: [String]
})


const User = mongoose.model('User', userSchema);

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];

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
            password: hashedPassword,
            library: []
        })

        

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
      console.log(token)
      console.log(user._id)
      res.status(200).json({ token: token, username: user.username, id: user._id.toString() });
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
        res.status(200).json({ library: user.library, id: user.id });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

app.put('/api/user', async (req, res) => {
    try{
        const userId = req.body.userId
        const mangaId = req.body.mangaId

        const user = await User.findById(userId)

        user.library.push(mangaId)

        await user.save()

    } catch (error) {

    }
})


app.delete('/api/:userId/:mangaId', async (req, res) => {
    try{
        const userId = req.params.userId
        const mangaId = req.params.mangaId

        await User.updateOne(
            {_id: userId},
            {$pull: {library: mangaId}}
        )
        
    } catch (error) {
        console.log(error)
    }
})


const librarySchema = new mongoose.Schema({
    series_id: String,
    series_img: String,
    series_title: String,
    series_chapters: String,
    series_comments: {
        type: Map,
        of: new mongoose.Schema({
            username: String,
            comments: [String]
        }, { _id: false })
    }
})

const Library = mongoose.model('Library', librarySchema);

app.get('/api/library/:id', async (req, res) => {
    try {
        console.log(req.params.id)
        const response = await Library.find( {series_id: req.params.id} )
        res.json(response)
    } catch (error) {
        console.log(error)
    }
})

app.post('/api/library', async (req, res) => {
    try {

        const newLibrary = new Library({
            series_id: req.body.mangaID,
            series_img: req.body.mangaImg,
            series_title: req.body.mangaTitle,
            series_chapters: req.body.mangaChapters,
            series_comments: {}
        });


        const seriesExist = await Library.exists( {series_id: req.body.mangaID} )
        console.log(seriesExist)
        
        if(!seriesExist) {
            await newLibrary.save();
            res.status(201).json( {message: 'Library successfully added'} )

        } else {
            res.status(201).json( {message: 'Series already existed'} )
        }

        

    } catch (error) {
        console.log(error)
    }
})

app.put('/api/library', async (req, res) => {
    try {

        const user = await User.findById(req.body.userID);

        console.log()

        const newLibrary = new Library({
            series_id: req.body.mangaID,
            series_img: req.body.mangaImg,
            series_title: req.body.mangaTitle,
            series_chapters: req.body.mangaChapters,
            series_comments: {
                [req.body.userID]: {
                    username: user.username,
                    comments: [req.body.userComment]
                }
            }
        });

        const seriesExist = await Library.exists( {series_id: req.body.mangaID} )

        if(!seriesExist) {
            await newLibrary.save();
            
        } else {
            const existingSeries = await Library.findOne({ series_id: req.body.mangaID });

            if (existingSeries.series_comments.has(req.body.userID)) {
                existingSeries.series_comments.get(req.body.userID).comments.push(req.body.userComment);
            } else {
                existingSeries.series_comments.set(req.body.userID, {
                    username: user.username,
                    comments: [req.body.userComment]
                });
            }
        
            await existingSeries.save();

        }
        
        

    } catch (error) {
        console.log(error)
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

    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.post("api/library", (req, res) => {
    
})



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
})


app.get("/series/:id", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manga-info.html'));
})

app.get("/library", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'library.html'));
})



app.listen(port, () => console.log(`Server running on port ${port}`))


