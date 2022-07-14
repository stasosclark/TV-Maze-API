"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(query) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let results = await axios.get(
    `https://api.tvmaze.com/search/shows?q=${query}`
  );
  console.log(results.data);
  return results.data;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src=${show.show.image.medium}
              alt=${show.show.name}
              class="w-25 mr-3"
              id=${show.show.id}>
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `
    );

    if (show.show.image === null) {
      $(`#${show.show.id}`).attr(src, "https://tinyurl.com/tv-missing");
    }
    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

$showsList.on("click", function (evt) {
  if (evt.target.tagName === "BUTTON") {
    let showID = $(evt.target).closest(".Show").data("show-id");
    console.log(showID);
    getEpisodesOfShow(showID);
  }
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let results = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  populateEpisodes(results.data);
}

/** Write a clear docstring for this function... */

function populateEpisodes(episodes) {
  $episodesArea.show();
  const $episodeList = $("#episodes-list");
  for (let episode of episodes) {
    const $episode = $(
      `<li>${episode.name}, season: ${episode.season}, number: ${episode.number}</li>`
    );
    $episodeList.append($episode);
  }
}
