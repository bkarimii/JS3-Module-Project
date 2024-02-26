////////FUNCTION DEFINITIONS \\\\\\\\\\\\
const rootAside = document.getElementById("root");
const searchBoxContainer = document.getElementById("search-box-container");

// =====================================
let numberOfFetches = 0;
const episodeObject = {};
// =====================================

function showCard(item) {
  //cloning the template for the cards
  const temp = document.getElementById("film-card");
  const card = temp.content.cloneNode(true);

  // using the padstart function to nominating episodes as we are asked to do
  const episode = padStartEpisodes(item.season, item.number);
  const filmTitle = card.getElementById("film-title");
  filmTitle.textContent = `${item.name}${episode}`;

  // // =================================
  filmTitle.addEventListener("click", () => clickOnTitle(item));
  // // ==========================

  const filmImage = card.getElementById("film-img");
  if (item.image.medium) {
    filmImage.src = item.image.medium;
    const alt = `image of ${episode} of ${item.name}`;
    filmImage.setAttribute("alt", alt);
  } else {
    filmImage.src = item.image;
    const alt = `image of ${episode} of ${item.name}`;
    filmImage.setAttribute("alt", alt);
  }

  const duration = card.getElementById("duration");
  duration.textContent = `Duration: ${item.runtime}`;

  const rate = card.getElementById("film-rate");
  rate.textContent = `Rate: ${item.rating.average}`;

  const status = card.getElementById("film-status");
  status.textContent = `Status: ${item.status}`;
  //============================================
  const filmGenre = card.getElementById("film-genre");
  content = item.genres.join(" | ");
  filmGenre.textContent = `Genre: ${content}`;

  //================================================

  const filmSummary = card.getElementById("film-summary");
  filmSummary.innerHTML = `<summary class='film-summary-tag'>Movie summary:</summary> +${item.summary}`;

  rootAside.appendChild(card);
}

function showAllCards(list) {
  for (let item of list) {
    showCard(item);
  }
}

/////////////LEVEL 300 CLASS PRACTICE////////////////
const apiUrl = "https://api.tvmaze.com/shows/82/episodes";
const allShowsUrl = "https://api.tvmaze.com/shows";
let showName;

// Function to show the popup
function showPopup() {
  document.getElementById("popup-container").style.display = "flex"; // Display the popup container
}

// Function to hide the popup
function hidePopup() {
  document.getElementById("popup-container").style.display = "none"; // Hide the popup container
}

function popupError(errorMessage) {
  document.getElementById("main").innerHTML = `<i
            class="fas fa-exclamation-triangle"
            style="font-size: 48px; color: red; display: none"
          ></i>
          <p>Error happened while loading the page: ${errorMessage}</p>`;
  //document.getElementById("popup-container").style.display = "flex"; // Display the popup container
}
// Make a GET request using the Fetch API
let list;
let newList;
async function fetchedData() {
  try {
    showPopup();

    await new Promise((resolve) => setTimeout(resolve, 2000));

    let response = await fetch(allShowsUrl);
    if (!response.ok) {
      throw new Error(`Error happened!${response.status}`);
    }
    let data = await response.json();
    list = data;
    list.sort(sortingArray);

    return data;
  } catch (error) {
    console.error("An error hapened during the fetch!");
    popupError(error.message);
  } finally {
    hidePopup();
  }
}

const fetchByTitle = (title) => {
  return list.filter((item) => {
    item.name == title;
  });
};

/////////////////////sort the returned array of all shows alphabetically/////////////
function sortingArray(a, b) {
  let nameA = a.name.toLowerCase();
  let nameB = b.name.toLowerCase();
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }
  return 0;
}

/////////////////////////////
/////////////////////

function padStartEpisodes(season, episode) {
  if (episode == undefined || season == undefined) {
    return "";
  }
  if (season < 10) {
    season = season.toString().padStart(2, "0");
  }
  if (episode < 10) {
    episode = episode.toString().padStart(2, "0");
  }
  // it returns nothing if season and episodes not available as in the shows we don't how season and episodes

  let seasonEpisode = `-S${season}E${episode}`;
  return seasonEpisode;
}

// this function create only a card . like template card and by using a loop we can create all the cards
// based on the available objects in tha list array

// this function reneder all the objects as cards to the page

fetchedData().then(() => {
  try {
    //showAllCards(list);
    showAllCards(list);
    createDropDownList(list, showDropDown);
  } catch (error) {
    console.log("an error happened during fetching the data", error.message);
    popupError(error.message);
  }
});

//comment to start level 200 by bkarimi

function createDropDownList(list, select) {
  for (let item of list) {
    const option = document.createElement("option");
    const episode = padStartEpisodes(item.season, item.number);
    option.value = `${item.name}${episode}`;
    //option.value = `${item.name}`;// Display the search counter
    //     searchCounter.innerHTML = `${resultCounter} item${
    //       resultCounter !== 1 ? "s" : ""
    //     } matched the search`;
    //     searchCounter.style.display = "inline-block";
    //   }
    option.textContent = `${item.name}${episode}`;
    select.appendChild(option);
  }
}

let dropDownValue = "";
let linkToFetch;
let secondDropValue = "";
let showValue = "";

//first drop box for all shows
const showDropDown = document.querySelector("#episode-drop-down");

//Dropdown select list of shows and episodes
showDropDown.addEventListener("change", () => {
  displayShowButton.style.display = "inline-block";
  dropDownValue = showDropDown.value;
  linkToFetch = getLink(dropDownValue);
  const foundItem = findEpisodeByTitle(list, dropDownValue);
  rootAside.innerHTML = "";
  sectionOfEpisodes.innerHTML = "";
  // clear the search box by any change in the drop down menue
  searchBox.value = "";
  if (foundItem) {
    showCard(foundItem);

    if (foundItem.id in episodeObject) {
      showAllCardsUpdated(episodeObject[foundItem.id]);
      showDropDown.innerHTML = "";

      const option = document.createElement("option");
      option.value = `${foundItem.name}`;
      option.textContent = "Show All Episodes";
      showDropDown.appendChild(option);

      // const initialOption = `<option value="${item.name}">Show All Episodes</option>`;
      // showDropDown.innerHTML = initialOption;
      createDropDownList(episodeObject[foundItem.id], showDropDown);
    } else {
      dynamicFetch(linkToFetch)
        .then(() => {
          episodeObject[foundItem.id] = data;
        })
        .then(() => {
          showAllCardsUpdated(episodeObject[foundItem.id]);
          showDropDown.innerHTML = "";
          const option = document.createElement("option");
          option.value = `${foundItem.name}`;
          option.textContent = "Show All Episodes";
          showDropDown.appendChild(option);
          // const initialOption = `<option value = ${foundItem.name}>Show All Episodes</option>`;
          // showDropDown.innerHTML = initialOption;
          createDropDownList(episodeObject[foundItem.id], showDropDown);
        });
    }
  } else {
    const foundShowObject = findEpisodeByTitle(list, firstOption());

    // foundEpisodeObject variable returns array of the episodes in the object of the all episodes
    const foundEpisodeObject = findEpisodeByTitle(
      episodeObject[foundShowObject.id],
      dropDownValue
    );
    showCard(foundShowObject);
    episodeCard(foundEpisodeObject);
  }

  //End of DropDown
});
/////////////////////////////this function find episode or show by title or drop down value//////////////////////////////////////////////
function findEpisodeByTitle(episodeList, title) {
  return episodeList.find((episode) => {
    const elementTitle = `${episode.name}${padStartEpisodes(
      episode.season,
      episode.number
    )}`;
    return elementTitle === title;
  });
}
/////////////////////////////////////////////////////////////
//
//
//
//
///////////////geting search box from the page//////////////
const searchBox = document.getElementById("search-box");
const searchButton = document.querySelector(".search");

//this variable is used inside the event listener to clear the page only once
let clearPage = true;
let resultCounter = 0;
const searchCounter = document.createElement("span");
searchCounter.id = "display-matched-result";

// searchButton.addEventListener("click" )
searchButton.addEventListener("click", () => {
  const searchBoxValue = searchBox.value.trim().toLowerCase();
  clearPage = true;
  resultCounter = 0;
  let isDropDownEmpty = dropDownValue == "";
  console.log(firstOption(), "first value of all showsS");

  if (isDropDownEmpty) {
    console.log("dropvalue is empty");
    const filteredShows = searchFunction(list, searchBoxValue);
    if (filteredShows) {
      rootAside.innerHTML = "";
      // searchNotFound();
      showAllCards(filteredShows);
      // Display the search counter
      searchCounter.innerHTML = `${filteredShows.length} item${
        filteredShows.length !== 1 ? "s" : ""
      } matched the search`;
      searchCounter.style.display = "inline-block";
    } else {
      searchNotFound();
    }
  } else {
    const foundShowObject = findEpisodeByTitle(list, firstOption());

    // foundEpisodeObject variable returns array of the episodes in the object of the all episodes
    const foundEpisodeObject = findEpisodeByTitle(
      episodeObject[foundShowObject.id],
      dropDownValue
    );
    // const filteredEpisodes = searchFunction(newList, searchBoxValue);
    const filteredEpisodes = searchFunction(
      episodeObject[foundShowObject.id],
      searchBoxValue
    );
    if (filteredEpisodes) {
      rootAside.innerHTML = "";

      sectionOfEpisodes.innerHTML = "";
      showAllCardsUpdated(filteredEpisodes);
      // Display the search counter
      searchCounter.innerHTML = `${filteredEpisodes.length} item${
        filteredEpisodes.length !== 1 ? "s" : ""
      } matched the search`;
      searchCounter.style.display = "inline-block";
    } else {
      searchNotFound();
    }
  }

  //searchBoxContainer.prepend(searchCounter);
  rootAside.prepend(searchCounter);
  //end of search box event listener
});

searchButton.disabled = true;
searchBox.addEventListener("input", () => {
  console.log(dropDownValue, "inside search Box");
  const searchBoxValue = searchBox.value.trim().toLowerCase();
  if (searchBoxValue == "") {
    searchButton.disabled = true;
    if (dropDownValue == "") {
      rootAside.innerHTML = "";
      sectionOfEpisodes.innerHTML = "";
      showAllCards(list);
    } else if (dropDownValue != "") {
      if (dropDownValue == firstOption()) {
        rootAside.innerHTML = "";

        const item = findEpisodeByTitle(list, dropDownValue);

        showCard(item);

        showAllCardsUpdated(episodeObject[item.id]);
      } else {
        rootAside.innerHTML = "";
        sectionOfEpisodes.innerHTML = "";

        const foundShowObject = findEpisodeByTitle(list, firstOption());
        console.log(foundShowObject, "new one for error");

        console.log(foundShowObject, "foundShow Object error");
        const foundEpisodeObject = findEpisodeByTitle(
          episodeObject[foundShowObject.id],
          dropDownValue
        );
        showCard(foundShowObject);
        episodeCard(foundEpisodeObject);
      }
    }
  } else {
    searchButton.disabled = false;
  }
});

/////////////this function select first value of the select dropdown/////
function firstOption() {
  // showDropDown.selectedIndex = 0;
  let firstValue = showDropDown.options[0].value;
  return firstValue;
}
//
//
//
//
//////////////Level 400 ----//////////////

// Define the getLink function

function getLink(dropDownValue) {
  let id = "";
  list.find((object) => {
    if (object.name === dropDownValue && dropDownValue != "") {
      id = object.id;
      return true;
      // Exit the loop when the object is found
    }
  });

  if (id) {
    const tvShowUrl = `https://api.tvmaze.com/shows/${id}/episodes`;
    return tvShowUrl;
  } else {
    // return "https://api.tvmaze.com/shows ";
    return undefined;
  }
}

async function dynamicFetch(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("dynamic fetch error in response");
    }
    data = await response.json();
    newList = data;

    return data;
  } catch (error) {
    console.error("Error happened in dynamic Fetch", error.message);
  }
}

// reach to the section which is going to hold episode series
const sectionOfEpisodes = document.getElementById("episode-container");
sectionOfEpisodes.style.display = "none";

/////updating show Card function for episodes///////////
function episodeCard(item) {
  //cloning the template for the cards
  const temp = document.getElementById("film-card");
  const card = temp.content.cloneNode(true);

  //adding another class for episode card
  const section = card.querySelector(".card");
  section.classList.add("episode-card");

  // using the padstart function to nominating episodes like -S01E01
  const episode = padStartEpisodes(item.season, item.number);
  const filmTitle = card.querySelector("#film-title");

  // getting the link of the episode for the original page
  const linkToEpisode = document.createElement("a");
  linkToEpisode.className = "link-to-original";
  linkToEpisode.setAttribute("href", item.url);
  linkToEpisode.textContent = `${item.name}${episode}`;

  filmTitle.appendChild(linkToEpisode);

  //===========================================

  const filmImage = card.querySelector("#film-img");
  if (item.image.medium) {
    filmImage.src = item.image.medium;
    const alt = `image of ${episode} of ${item.name}`;
    filmImage.setAttribute("alt", alt);
  } else {
    filmImage.src = item.image;
    const alt = `image of ${episode} of ${item.name}`;
    filmImage.setAttribute("alt", alt);
  }

  const duration = card.querySelector("#duration");
  duration.textContent = `Duration: ${item.runtime}`;

  const filmSummary = card.querySelector("#film-summary");
  filmSummary.innerHTML = `<summary class='film-summary-tag'>Movie summary:</summary> ${item.summary}`;

  // ===================================================
  const rate = card.getElementById("film-rate");
  rate.textContent = `Rate: ${item.rating.average}`;

  const status = card.getElementById("film-status");
  if (item.status != undefined) {
    status.textContent = `Status: ${item.status}`;
  } else {
    status.style.display = "none";
  }

  const filmGenre = card.getElementById("film-genre");
  if (item.genres != undefined) {
    content = item.genres.join(" | ");
  } else {
    filmGenre.style.display = "none";
  }
  // =====================================================

  card.class = "episode-card";
  sectionOfEpisodes.style.display = "block";
  sectionOfEpisodes.appendChild(card);

  rootAside.appendChild(sectionOfEpisodes);
}

function showAllCardsUpdated(list) {
  for (let item of list) {
    episodeCard(item);
  }
}

/// this function finds index of the objects in the fetched array base on the name property in the object
// function findIndexByName(n, array) {
//   const indexOfObject = array.findIndex((item) => {
//     return item.name == n;
//   });
//   return indexOfObject;
// }

// ==========LEVEL 500 ==========

const displayShowButton = document.getElementById("all-show-button");
// by clicking on it , returns back to main page
displayShowButton.addEventListener("click", () => {
  rootAside.innerHTML = "";
  showAllCards(list);
  showDropDown.innerHTML = "";
  const option = document.createElement("option");
  option.value = "";
  option.textContent = "show All Series";
  showDropDown.appendChild(option);
  createDropDownList(list, showDropDown);
  searchBox.value = "";
  displayShowButton.style.display = "none";

  console.log(dropDownValue, "inside button");
});

function searchFunction(array, content) {
  const searchResult = [];
  array.filter((item) => {
    if (
      item.name.toLowerCase().includes(content) ||
      item.summary.toLowerCase().includes(content) ||
      (item.genres && item.genres.includes(content))
    ) {
      searchResult.push(item);
    }
  });
  return searchResult;
}

function searchNotFound() {
  const temp = document.getElementById("serach-not-found");
  card = temp.content.cloneNode(true);

  //const bigDiv = temp.querySelector("#no-match-for-search-div");
  const h2InsideDiv = card.querySelector("#no-match-for-search");
  h2InsideDiv.textContent = "No item matched the search.";

  rootAside.appendChild(card);
}

function idFinder(title) {
  let id = "";
  list.find((object) => {
    if (object.name === title) {
      id = object.id;
      return id;
      // Exit the loop when the object is found
    }
  });
}

function clickOnTitle(item) {
  // const episode = padStartEpisodes(item.season, item.number);
  const name = `${item.name}`;
  dropDownValue = name;
  if (item.id in episodeObject) {
    rootAside.innerHTML = "";
    sectionOfEpisodes.innerHTML = "";
    // showDropDown.innerHTML = "";
    // const initialOption = `<option value = ${name}>Show All Episodes</option>`;
    // showDropDown.innerHTML = initialOption;
    showDropDown.innerHTML = "";
    const option = document.createElement("option");
    option.value = `${name}`;
    option.textContent = "Show All Episodes";
    showDropDown.appendChild(option);
    createDropDownList(episodeObject[item.id], showDropDown);
    displayShowButton.style.display = "inline-block";
    showCard(item);
    showAllCardsUpdated(episodeObject[item.id]);
  } else {
    const tvShowUrl = `https://api.tvmaze.com/shows/${item.id}/episodes`;
    dynamicFetch(tvShowUrl)
      .then(() => {
        episodeObject[item.id] = data;
      })
      .then(() => {
        rootAside.innerHTML = "";
        sectionOfEpisodes.innerHTML = "";
        showCard(item);
        showAllCardsUpdated(episodeObject[item.id]);
        // showDropDown.innerHTML = "";
        // const initialOption = `<option value = ${name}>Show All Episodes</option>`;
        // showDropDown.innerHTML = initialOption;
        showDropDown.innerHTML = "";
        const option = document.createElement("option");
        option.value = `${name}`;
        option.textContent = "Show All Episodes";
        showDropDown.appendChild(option);
        createDropDownList(episodeObject[item.id], showDropDown);
        displayShowButton.style.display = "inline-block";
      });
  }
}
