axios.get('/api/releases')
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.log("Error fetching data:", error);
    });

