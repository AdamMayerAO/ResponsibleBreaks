'use strict';

const apiKey = 
"AIzaSyAxmelNASa0uSVaqf38SNk8UkJ-XP3b5q4"
const youTubeURL = 'https://www.googleapis.com/youtube/v3/search';



function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}
function getVideoLength(ids, minutes){
    const url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${ids}&key=${apiKey}`
    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => filterByLength(responseJson, minutes))
    .catch(err => {
        console.error(err)
        });
}
function filterByLength(responseJson, minutes){

  minutes=parseInt(minutes);
  let desiredResults = []
  let time = ""
  let x = 0
  
    for (let i = 0; i<responseJson.items.length; i++){   
      let duration =  responseJson.items[i].contentDetails.duration
      if(duration.includes("H")) continue; //don't add videos over 1 hour
      if(duration.includes("P0D")) continue; //don't add live streams
      const m = duration.search("M")
      time = duration.slice(2,m)
      time = parseInt(time);
      if (time <= minutes && x<3){
        desiredResults.push(responseJson.items[i]);
        x++;
        
      }
  }
  displayResults(desiredResults); 
}

function getTEDTalks(searchTerm, minutes){
      fetch(`https://bestapi-ted-v1.p.rapidapi.com/talksByDescription?description=${searchTerm}&size=50`, {
      "method": "GET",
      "headers": {
        "x-rapidapi-key": "28b9f4532bmsh288e09dc8ff4fc5p12b50cjsnf4b7f74f47dd",
        "x-rapidapi-host": "bestapi-ted-v1.p.rapidapi.com"
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
        })
      
      .then(responseJson => getVideoLength(responseJson.map(item=>item.youTubeID), minutes))
     
      .catch(err => {
        console.error(err);
        });
} 

function displayResults(desiredResults) {
  
  
  for (let i = 0; i < desiredResults.length; i++){
    $('#results-list').append(
      `<li>
        <h3><a href="https://www.youtube.com/watch?v=${desiredResults[i].id} target="_blank">${desiredResults[i].snippet.title}</a></h3>
      
        <div class = iframe-container>
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${desiredResults[i].id}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      
      </li>`
    );
  }
  $('#results').removeClass('hidden');
};


function getYouTubeVideos(query, minutes) {
  let time = ""
  if (minutes<=4){
      time = "short";
    } else if (minutes>4 && minutes<20){
      time = "medium";
    } else{
      time = "long";
  }
  const params = {
    key: apiKey,
    q: query,
    part: 'snippet',
    maxResults: 50,
    type: 'video',
    videoDuration: time,
  };
  const queryString = formatQueryParams(params)
  const url = youTubeURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => getVideoLength(responseJson.items.map(item=>item.id.videoId), minutes))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}
function displayResultsTitle(searchTerm){
  const results = searchTerm[0].toUpperCase() + searchTerm.substring(1)
  $('#title').replaceWith(`<h1 id ='title'>"${results}" Results:</h1>`);
  $('#js-form').addClass('hidden');
  $('.reset').removeClass('hidden');
  $('.reset').click(function(event){
    $('#js-form').removeClass('hidden');
    $('.reset').toggleClass('hidden');
    $('#results-list').empty();
    $('#title').replaceWith(`<h1 id ='title'>Try Something Else:</h1>`);
  });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#results-list').empty();
    const searchTerm = $('#js-search-term').val();
    const minutes = $('#minutes').val();
    getYouTubeVideos(searchTerm, minutes);
   // getTEDTalks(searchTerm, minutes);
    displayResultsTitle(searchTerm);
  });
}

$(watchForm);