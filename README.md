# manga-track

<p align="center">
  <img src="public/css/logo.png" alt="Jetpack Compose Logo" width="600" />
</p>


# Links
  - Video Presentation: https://www.youtube.com/watch?v=RvJznzn06sQ


# Description
A website for all your Manga(Japanese), Manwha(Korean), and Manhua(Chinese) series information. It also tracks your series for any updates and notify you via web push notifications.


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
        


