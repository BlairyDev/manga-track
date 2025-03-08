const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

const app = express();

const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "public")));


app.use(cors());
app.use(express.json());

app.get("/api/releases", async (req, res) => {
    try{
        const response = await axios.get("https://api.mangaupdates.com/v1/releases/days");
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

app.get("/api/series", async (req, res) => {
    try {
        const mangaID = req.query.id;  // Get mangaID from query parameters

        if (!mangaID) {
            return res.status(400).json({ error: "Manga ID is required" });
        }

        console.log("Fetching data for manga ID:", mangaID);

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://api.mangaupdates.com/v1/series/${mangaID}`, // Use mangaID dynamically
            headers: {} // Remove `data.getHeaders()` unless needed
        };

        const response = await axios.request(config);
        res.json(response.data); // Send response back to frontend
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});





app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
})

app.listen(port, () => console.log(`Server running on port ${port}`))

