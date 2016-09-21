// Include the axios package for performing HTTP requests (promise based alternative to request)
var axios = require('axios');

// This variable will be pre-programmed with our authentication key (the one we received when we registered)
var authKey = "b9f91d369ff59547cd47b931d8cbc56b:0:74623931";

// Helper Functions (in this case the only one is runQuery)
var helpers = {

  // This function serves our purpose of running the query to geolocate. 
  runQuery: function(searchTerm, startDate, endDate){

    console.log(searchTerm, startDate, endDate);

    // Based on the queryTerm we will create a queryURL 
    var queryURL = "https://crossorigin.me/https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + authKey + "&q=" + searchTerm + "&begin_date=" + startDate + "0101" + "&end_date=" + endDate + "0101";

    return axios.get(queryURL)
      .then(function(response){

        console.log(response);
        return response.docs[0].formatted;
    })

  },

  // This function hits our own server to retrieve the record of query results
  getHistory: function(){

    return axios.get('/api/saved')
      .then(function(response){

        console.log(response);
        return response;
      });
  },

  // This function posts new searches to our database.
  postHistory: function(article){

    return axios.post('/', {title: article})
      .then(function(results){

        console.log("Posted to MongoDB");
        return(results);
      })
  }

}


// We export the helpers function 
module.exports = helpers;