//You can edit ALL of the code here

// function setup() {
//   const allEpisodes = getAllEpisodes();
//   makePageForEpisodes(allEpisodes);
// }

// function makePageForEpisodes(episodeList) {
//   const rootElem = document.getElementById("root");
//   rootElem.textContent = `Got ${episodeList.length} episode(s)`;
// }

//window.onload = setup;

//const card = document.getElementById("film-card").content.cloneNode(true);
//
//
//
//
//
////////FUNCTION DEFINITIONS \\\\\\\\\\\\
const rootAside = document.getElementById("root");
const searchBoxContainer = document.getElementById("search-box-container");

// =====================================
let numberOfFetches = 0;
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
  if (season < 10 && !undefined) {
    season = season.toString().padStart(2, "0");
  }
  if (episode < 10 && !undefined) {
    episode = episode.toString().padStart(2, "0");
  }
  // it returns nothing if season and episodes not available as in the shows we don't how season and episodes
  if (episode == undefined || season == undefined) {
    return "";
  }
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
//second drop box episodes
//const episodeDropDown = document.querySelector("#show-drop-down");
//first drop box for all shows
const showDropDown = document.querySelector("#episode-drop-down");
console.log(showDropDown.value, "this is drop value out of eventlistener");
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
  }
  // else {
  //   showAllCards(list);
  // }
  if (linkToFetch) {
    dynamicFetch(linkToFetch).then(() => {
      numberOfFetches++;
      console.log(numberOfFetches, "------------NUMBER OF FETCH");
      const initialOption = `<option value="${dropDownValue}">Show All Episodes</option>`;
      showDropDown.innerHTML = initialOption;
      createDropDownList(newList, showDropDown);
      showAllCardsUpdated(newList);
      const foundEpisode = findEpisodeByTitle(newList, dropDownValue);
      // console.log(dropDownValue, "dropValueInside Fetch");
      // console.log(foundEpisode, "----foundEpisode");
      showValue = dropDownValue;
      // console.log(showValue, "showvalue inside fetch");
    });
  } else {
    if (dropDownValue == "") {
      //episodeDropDown.innerHTML = '<option value="">Show All Episodes</option>';
      newList = [];
    } else {
      const ShowCover = findEpisodeByTitle(list, showValue);
      showCard(ShowCover);
      const episodeItem = findEpisodeByTitle(newList, dropDownValue);
      //console.log(episodeItem);
      episodeCard(episodeItem);
      //console.log(showValue, "showvalue inside else part of fetch");
    }
  }
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
  if (isDropDownEmpty) {
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
    // console.log(newList[0], "<---------------this is new list");
    const filteredEpisodes = searchFunction(newList, searchBoxValue);
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

searchBox.addEventListener("input", () => {
  const searchBoxValue = searchBox.value.trim().toLowerCase();
  if (searchBoxValue == "") {
    if (dropDownValue == "") {
      rootAside.innerHTML = "";
      sectionOfEpisodes.innerHTML = "";
      showAllCards(list);
    } else if (dropDownValue != "") {
      if (dropDownValue == firstOption()) {
        rootAside.innerHTML = "";

        const item = findEpisodeByTitle(list, dropDownValue);
        showCard(item);
        showAllCardsUpdated(newList);
      } else {
        rootAside.innerHTML = "";
        sectionOfEpisodes.innerHTML = "";
        const showCover = findEpisodeByTitle(list, firstOption());
        const episode = findEpisodeByTitle(newList, dropDownValue);
        showCard(showCover);
        episodeCard(episode);
      }
    }
  }
});

/////////////this function select first value of the select dropdown/////
function firstOption() {
  showDropDown.selectedIndex = 0;
  let firstValue = showDropDown.options[showDropDown.selectedIndex].value;
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
displayShowButton.addEventListener("click", () => {
  rootAside.innerHTML = "";
  showAllCards(list);
  const initialOption = '<option value="">Show All Shows</option>';
  showDropDown.innerHTML = initialOption;
  createDropDownList(list, showDropDown);
  displayShowButton.style.display = "none";
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
  h2InsideDiv.textContent = "Unfortunately, no term matched the search.";

  rootAside.appendChild(card);
}

//////Test function for clicking on title initial Demo///////

// function clickOnTitle(list) {
//   const sections = document.querySelectorAll(".card");
//   for (const section of sections) {
//     const titleElement = section.querySelector("h2#film-title");
//     const titleElementContent = titleElement.textContent.trim();
//     if (titleElement) {
//       const item = list.find((object) =>
//         object.name.includes(titleElementContent)
//       );
//       // Add your event listener here, e.g.:
//       titleElement.addEventListener("click", () => {
//         console.log("Clicked on title:", titleElement.textContent);
//         console.log("item", item);
//         rootAside.innerHTML = "";
//         episodeCard(item);
//         showAllCards(newList);
//       });
//     }
//   }
// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////\\\\\\\\\\\\\\\\\=======SECOND BACK UP==========/////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//this bakc up is for the searchButton on click
//
// searchBox.addEventListener("input", () => {
//   const searchBoxValue = searchBox.value.trim().toLowerCase();
//   clearPage = true;
//   resultCounter = 0;

//   if (searchBoxValue === "") {
//     //if search box is empty and drop down is empty display all the shows
//     // console.log(episodeDropDown.value, "valueeee");
//     if (dropDownValue == "") {
//       //console.log(dropDownValue, "<-----");
//       rootAside.innerHTML = "";
//       showAllCards(list);
//       searchCounter.innerHTML = "";
//       searchCounter.style.display = "none";
//     } else if (dropDownValue != "") {
//       console.log(dropDownValue, "dropdown value inside search box");
//       rootAside.innerHTML = "";
//       //check if all episode are shown in the page
//       //when search box cleared all episodes are shown in the page again
//       //let isTitle = list.find((item) => item.name.includes(dropDownValue));
//       const object = findEpisodeByTitle(list, dropDownValue);
//       //console.log(object, "<----this is Object founded by func");
//       if (object) {
//         showCard(object);
//         showAllCardsUpdated(newList);
//       } else {
//         rootAside.innerHTML = "";
//         const episodeToShow = findEpisodeByTitle(newList, dropDownValue);
//         episodeCard(episodeToShow);
//       }
//       searchCounter.style.display = "none";
//     }
//   } else if (searchBoxValue !== "") {
//     if (dropDownValue == "") {
//       list.forEach((element) => {
//         // set name and summary to lower case for using include method
//         const elementNamelowerCase = element.name.toLowerCase();
//         const elementSummaryLowerCase = element.summary.toLowerCase();

//         // check for including
//         const includeName = elementNamelowerCase.includes(searchBoxValue);
//         const includeSummary = elementSummaryLowerCase.includes(searchBoxValue);

//         if (includeName || includeSummary) {
//           console.log(element.name, "element.name-----------");
//           console.log(element.summary, "-----element.summary");
//           resultCounter++;
//           if (clearPage) {
//             rootAside.innerHTML = "";
//             clearPage = false;
//           }
//           //rootAside.innerHTML = "";
//           showCard(element);
//           //episodeCard(element);
//         }
//       });
//     } else if (dropDownValue != "") {
//       // const object = findEpisodeByTitle(list, dropDownValue);
//       // console.log(object, "<--------object to observe in search box");

//       newList.forEach((element) => {
//         // set name and summary to lower case for using include method
//         const elementNamelowerCase = element.name.toLowerCase();
//         const elementSummaryLowerCase = element.summary.toLowerCase();

//         // check for including
//         const includeName = elementNamelowerCase.includes(searchBoxValue);
//         const includeSummary = elementSummaryLowerCase.includes(searchBoxValue);

//         if (includeName || includeSummary) {
//           console.log(element.name, "element.name-----------");
//           console.log(element.summary, "-----element.summary");
//           resultCounter++;
//           episodeCard(element);
//           if (clearPage) {
//             rootAside.innerHTML = "";
//             clearPage = false;
//           }
//           // rootAside.innerHTML = "";
//           //showCard(element);
//         }
//       });
//     }

//     // Display the search counter
//     searchCounter.innerHTML = `${resultCounter} item${
//       resultCounter !== 1 ? "s" : ""
//     } matched the search`;
//     searchCounter.style.display = "inline-block";
//   }

//   rootAside.prepend(searchCounter);
//   //end of search box event listener
// });
