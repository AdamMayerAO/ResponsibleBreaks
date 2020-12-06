'use strict';

const apiKey = 
"AIzaSyAxmelNASa0uSVaqf38SNk8UkJ-XP3b5q4"
const searchURL = 'https://www.googleapis.com/youtube/v3/search';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  // if there are previous results, remove them
  console.log(responseJson);
  $('#results-list').empty();
  
  for (let i = 0; i < responseJson.items.length; i++){
    
    $('#results-list').append(
      `<li><h3><a href="${responseJson.items[i].snippet.thumbnails.default.url}" target="_blank">${responseJson.items[i].snippet.title}</a></h3>
      
      <h3><a href="${responseJson.items[i].snippet.thumbnails.default.url}" target="_blank"><img src='${responseJson.items[i].snippet.thumbnails.default.url}'></a></h3>
      </li>`
    )};
  $('#results').removeClass('hidden');
};

function getVideos(query, maxResults=3, minutes) {
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
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const minutes = $('#minutes').val();
    getVideos(searchTerm, minutes);
  });
}

$(watchForm);