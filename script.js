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

/////////////LEVEL 300 CLASS PRACTICE////////////////
const apiUrl = "https://api.tvmaze.com/shows/82/episodes";
const allShowsUrl = "https://api.tvmaze.com/shows ";
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

const rootAside = document.getElementById("root");

function showCard(item) {
  //cloning the template for the cards
  const temp = document.getElementById("film-card");
  const card = temp.content.cloneNode(true);

  // using the padstart function to nominating episodes as we are asked to do
  const episode = padStartEpisodes(item.season, item.number);
  const filmTitle = card.getElementById("film-title");
  filmTitle.textContent = `${item.name}${episode}`;

  const filmImage = card.getElementById("film-img");
  filmImage.src = item.image.medium;
  const alt = `image of ${episode} of ${item.name}`;
  filmImage.setAttribute("alt", alt);

  const duration = card.getElementById("duration");
  duration.textContent = `Duration: ${item.runtime}`;

  const filmSummary = card.getElementById("film-summary");
  filmSummary.innerHTML = `<summary class='film-summary-tag'>Movie summary:</summary> +${item.summary}`;

  rootAside.appendChild(card);
}

// this function reneder all the objects as cards to the page
function showAllCards(list) {
  for (let item of list) {
    showCard(item);
  }
}

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
    option.textContent = `${item.name}${episode}`;
    select.appendChild(option);
  }
}

let dropDownValue;
let linkToFetch;
let secondDropValue;

//second drop box episodes
const episodeDropDown = document.querySelector("#show-drop-down");
//first drop box for all shows
const showDropDown = document.querySelector("#episode-drop-down");
showDropDown.addEventListener("change", () => {
  dropDownValue = showDropDown.value;
  linkToFetch = getLink(dropDownValue);
  //console.log(linkToFetch, "this is link");
  const foundItem = list.find((episode) => {
    const elementTitle = `${episode.name}${padStartEpisodes(
      episode.season,
      episode.number
    )}`;
    //console.log(elementTitle, "elementTitle");
    return elementTitle === dropDownValue;
  });
  // rootAside.innerHTML = "";
  rootAside.innerHTML = "";
  sectionOfEpisodes.innerHTML = "";
  if (foundItem) {
    showCard(foundItem);
  } else {
    showAllCards(list);
    //episodeDropDown.innerHTML = '<option value="">Show All Episodes</option>';
  }
  if (linkToFetch) {
    dynamicFetch(linkToFetch).then(() => {
      //second dropBox for episodes
      console.log(linkToFetch);
      secondDropValue = episodeDropDown.value;
      console.log("-secondDropDown-------->", secondDropValue);

      const initialOption = '<option value="">Show All Episodes</option>';
      //console.log(newList, "new list inside the event");
      episodeDropDown.innerHTML = initialOption;
      createDropDownList(newList, episodeDropDown);
      // const episodesSection = document.createElement("section");
      // episodesSection.id = "episode-of-each-series";
      console.log(newList, "newList 2222");
      showAllCardsUpdated(newList);
      // showAllCards(newList);
    });
  } else {
    console.log(linkToFetch);
    if (dropDownValue == "") {
      episodeDropDown.innerHTML = '<option value="">Show All Episodes</option>';
      newList = [];
    }
  }
});

///////////////////////////////////////////////////////////////////////////

/////////add event listener for the second dropdown///////////
//Second drop down
episodeDropDown.addEventListener("change", () => {
  secondDropValue = episodeDropDown.value;
  // console.log(secondDropValue, "=============");
  const foundEpisode = newList.find((episode) => {
    const elementTitle = `${episode.name}${padStartEpisodes(
      episode.season,
      episode.number
    )}`;
    //console.log(elementTitle, "elementTitle");
    return elementTitle === secondDropValue;
  });

  rootAside.innerHTML = "";
  sectionOfEpisodes.innerHTML = "";

  // find the item to be shown on the top for each episode , in other word based on the value in the first dropdown
  //we'll find the object index to show the cover of each series on the top of episodes
  let indexOfItemForCard = findIndexByName(dropDownValue, list);
  if (foundEpisode) {
    let itemForCard = findIndexByName(dropDownValue, list);
    showCard(list[indexOfItemForCard]);
    console.log(dropDownValue, "dropvalueXXX");
    showCardUpdated(foundEpisode);
  } else {
    showCard(list[indexOfItemForCard]);
    showAllCardsUpdated(newList);
    //episodeDropDown.innerHTML = '<option value="">Show All Episodes</option>';
  }
});

/////////////////////////////////////////////////////////////////////
//
//
//
//
// geting search box from the page
const searchBox = document.getElementById("search-box");

//this variable is used inside the event listener to clear the page only once
let clearPage = true;
let resultCounter = 0;
const searchCounter = document.createElement("span");
searchCounter.id = "display-matched-result";
searchBox.addEventListener("input", () => {
  const searchBoxvalue = searchBox.value.trim().toLowerCase();
  clearPage = true;
  resultCounter = 0;

  if (searchBoxvalue === "") {
    document.getElementById("root").innerHTML = "";
    showAllCards(list);
    searchCounter.innerHTML = "";
    searchCounter.style.display = "none";
  } else {
    list.forEach((element) => {
      // set name and summary to lower case for using include method
      const elementNamelowerCase = element.name.toLowerCase();
      const elementSummaryLowerCase = element.summary.toLowerCase();

      // check for including
      const includeName = elementNamelowerCase.includes(searchBoxvalue);
      const includeSummary = elementSummaryLowerCase.includes(searchBoxvalue);

      if (includeName || includeSummary) {
        resultCounter++;
        if (clearPage) {
          document.getElementById("root").innerHTML = "";
          clearPage = false;
        }

        showCard(element);
      }
    });

    // Display the search counter
    searchCounter.innerHTML = `${resultCounter} item${
      resultCounter !== 1 ? "s" : ""
    } matched the search`;
    searchCounter.style.display = "inline-block";
  }
  rootAside.prepend(searchCounter);
});

//////////////Level 400 ----//////////////

// Define the getLink function
function getLink(dropDownValue) {
  let id;
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

// reach to the section whicj is going to hold episode series
const sectionOfEpisodes = document.getElementById("episode-container");
sectionOfEpisodes.style.display = "none";

/////updating show Card function for episodes///////////
function showCardUpdated(item, parent) {
  //cloning the template for the cards
  const temp = document.getElementById("film-card");
  const card = temp.content.cloneNode(true);

  // using the padstart function to nominating episodes like -S01E01
  const episode = padStartEpisodes(item.season, item.number);
  const filmTitle = card.querySelector("#film-title");
  filmTitle.textContent = `${item.name}${episode}`;

  const filmImage = card.querySelector("#film-img");
  filmImage.src = item.image.medium;
  const alt = `image of ${episode} of ${item.name}`;
  filmImage.setAttribute("alt", alt);

  const duration = card.querySelector("#duration");
  duration.textContent = `Duration: ${item.runtime}`;

  const filmSummary = card.querySelector("#film-summary");
  filmSummary.innerHTML = `<summary class='film-summary-tag'>Movie summary:</summary> ${item.summary}`;
  sectionOfEpisodes.style.display = "block";
  sectionOfEpisodes.appendChild(card);

  rootAside.appendChild(sectionOfEpisodes);
}

function showAllCardsUpdated(list) {
  for (let item of list) {
    showCardUpdated(item);
  }
}

/// this function finds index of the objects in the fetched array base on the name property in the object

function findIndexByName(n, array) {
  const indexOfObject = array.findIndex((item) => {
    return item.name == n;
  });
  return indexOfObject;
}

// arr = [
//   {
//     id: 1,
//     url: "https://www.tvmaze.com/shows/1/under-the-dome",
//     name: "Domeyt",
//     type: "Scripted",
//     language: "English",
//     genres: ["Drama", "Science-Fiction", "Thriller"],
//     status: "Ended",
//     runtime: 60,
//     averageRuntime: 60,
//     premiered: "2013-06-24",
//     ended: "2015-09-10",
//     officialSite: "http://www.cbs.com/shows/under-the-dome/",
//     schedule: {
//       time: "22:00",
//       days: ["Thursday"],
//     },
//     rating: {
//       average: 6.5,
//     },
//     weight: 99,
//     network: {
//       id: 2,
//       name: "CBS",
//       country: {
//         name: "United States",
//         code: "US",
//         timezone: "America/New_York",
//       },
//       officialSite: "https://www.cbs.com/",
//     },
//     webChannel: null,
//     dvdCountry: null,
//     externals: {
//       tvrage: 25988,
//       thetvdb: 264492,
//       imdb: "tt1553656",
//     },
//     image: {
//       medium:
//         "https://static.tvmaze.com/uploads/images/medium_portrait/81/202627.jpg",
//       original:
//         "https://static.tvmaze.com/uploads/images/original_untouched/81/202627.jpg",
//     },
//     summary:
//       "<p><b>Under the Dome</b> is the story of a small town that is suddenly and inexplicably sealed off from the rest of the world by an enormous transparent dome. The town's inhabitants must deal with surviving the post-apocalyptic conditions while searching for answers about the dome, where it came from and if and when it will go away.</p>",
//     updated: 1704794065,
//     _links: {
//       self: {
//         href: "https://api.tvmaze.com/shows/1",
//       },
//       previousepisode: {
//         href: "https://api.tvmaze.com/episodes/185054",
//       },
//     },
//   },
//   {
//     id: 1,
//     url: "https://www.tvmaze.com/shows/1/under-the-dome",
//     name: "Dome",
//     type: "Scripted",
//     language: "English",
//     genres: ["Drama", "Science-Fiction", "Thriller"],
//     status: "Ended",
//     runtime: 60,
//     averageRuntime: 60,
//     premiered: "2013-06-24",
//     ended: "2015-09-10",
//     officialSite: "http://www.cbs.com/shows/under-the-dome/",
//     schedule: {
//       time: "22:00",
//       days: ["Thursday"],
//     },
//     rating: {
//       average: 6.5,
//     },
//     weight: 99,
//     network: {
//       id: 2,
//       name: "CBS",
//       country: {
//         name: "United States",
//         code: "US",
//         timezone: "America/New_York",
//       },
//       officialSite: "https://www.cbs.com/",
//     },
//     webChannel: null,
//     dvdCountry: null,
//     externals: {
//       tvrage: 25988,
//       thetvdb: 264492,
//       imdb: "tt1553656",
//     },
//     image: {
//       medium:
//         "https://static.tvmaze.com/uploads/images/medium_portrait/81/202627.jpg",
//       original:
//         "https://static.tvmaze.com/uploads/images/original_untouched/81/202627.jpg",
//     },
//     summary:
//       "<p><b>Under the Dome</b> is the story of a small town that is suddenly and inexplicably sealed off from the rest of the world by an enormous transparent dome. The town's inhabitants must deal with surviving the post-apocalyptic conditions while searching for answers about the dome, where it came from and if and when it will go away.</p>",
//     updated: 1704794065,
//     _links: {
//       self: {
//         href: "https://api.tvmaze.com/shows/1",
//       },
//       previousepisode: {
//         href: "https://api.tvmaze.com/episodes/185054",
//       },
//     },
//   },
// ];
// console.log(findIndexByName("Dome", arr), "test for index");
