'use strict';

const apiKey = 
"AIzaSyAxmelNASa0uSVaqf38SNk8UkJ-XP3b5q4"
const youTubeURL = 'https://www.googleapis.com/youtube/v3/search';

const tedApiKey = "28b9f4532bmsh288e09dc8ff4fc5p12b50cjsnf4b7f74f47dd"
const tedUrl = 'https://bestapi-ted-v1.p.rapidapi.com/talksByDescription'


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayTEDResults(responseJson){

  console.log(responseJson)
  for (let i = 0; i < responseJson.items.length; i++){


  $('#results-list').append(
        `<li>
        
        </li>`
  )}
  }

function displayYouTubeResults(responseJson) {
  // if there are previous results, remove them
  
  
  for (let i = 0; i < responseJson.items.length; i++){
    
    $('#results-list').append(
      `<li><h3><a href="${'https://www.youtube.com/watch?v='+responseJson.items[0].id.videoId}" target="_blank">${responseJson.items[i].snippet.title}</a></h3>
      
      <a href="${'https://www.youtube.com/watch?v='+responseJson.items[0].id.videoId}" target="_blank"><img src='${responseJson.items[i].snippet.thumbnails.default.url}'></a>
      
      </li>`
    )};
  $('#results').removeClass('hidden');
};

function getTEDTalks(query){
  console.log('here')
  const params = {
    key: tedApiKey,
    q: query,
  };
  const queryString = formatQueryParams(params)
  const url = tedUrl + '?' + queryString;
fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayTEDResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });

}

function getYouTubeVideos(query, minutes) {
  let time = ""
  if (minutes<4){
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
    maxResults: 3,
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
    .then(responseJson => displayYouTubeResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $('#results-list').empty();
    const searchTerm = $('#js-search-term').val();
    const minutes = $('#minutes').val();
    getYouTubeVideos(searchTerm, minutes);
    getTEDTalks(searchTerm);

  });
}

$(watchForm);