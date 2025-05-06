# manga-track

# Links
  - Video Presentation: https://www.youtube.com/watch?v=25q7lqFw_Eg
  - Github Pages: N/A (MangaUpdates API not working with Github Pages and I was not able to grab the data. Resulting to running it on NodeJS to make it work. Please read README.md further for instructions on how to run it)


# Description
A website for all your Manga(Japanese), Manwha(Korean), and Manhua(Chinese) series information. It also tracks your series for any updates and notify you on your mobile devices.


# Members and Contributions

## Blair Asistin(Individual)



# Instructions to run the website

1. Clone the repository
    ```terminal
    git clone git@github.com:BlairyDev/manga-track.git
                        or
    git clone https://github.com/BlairyDev/manga-track.git

2. Install dependencies in terminal
    ```terminal
    npm install

3. In `config.env` Add your mongodb credentials and VAPID keys(you can generate a key here: https://web-push-codelab.glitch.me/)
   ```terminal
    MONGODB_URL = add your credentials here
    VAPID_PUBLIC_KEY = add key here
    VAPID_PRIVATE_KEY = add key here

4. Run the server(to make MangaUpdates API work)
    ```terminal
    node server.js

5. Open website with this link
    ```terminal
    http://localhost:8080/
        


