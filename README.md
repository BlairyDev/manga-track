# manga-track

# Links
  - Video Presentation: https://www.youtube.com/watch?v=25q7lqFw_Eg
  - Github Pages: N/A (MangaUpdates API not working with Github Pages and I was not able to grab the data. Resulting to running it on NodeJS to make it work. Please read README.md further for instructions on how to run it)


# Description
A website for all your Manga(Japanese), Manwha(Korean), and Manhua(Chinese) series information. It also tracks your series for any updates and notify you on your mobile devices.


# Members and Contributions

## Blair Asistin(Individual)

### Contributions

- Made the HTML structure index.html, library.html, login.html, manga-info.html, register.html, and search-results.html
- Made the pages responsive with CSS and Bootstrap
- Use jsonBlob to store user information and series
- Use MangaUpdates API to fetch the series data


# Instructions to run the website

1. Clone the repository
    ```terminal
    git clone git@github.com:BlairyDev/manga-track.git
                        or
    git clone https://github.com/BlairyDev/manga-track.git

2. Install dependencies in terminal
    ```terminal
    npm install

3. Run the server(to make MangaUpdates API work)
    ```terminal
    node server.js

4. Open website with this link
    ```terminal
    http://localhost:8080/
        


