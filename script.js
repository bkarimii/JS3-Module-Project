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
let dataObject;

//////////////////////////////
/////////////////////////////

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
    return data;
  } catch (error) {
    console.error("An error hapened during the fetch!");
    popupError(error.message);
  } finally {
    hidePopup();
  }
}

/////////////////////////////
/////////////////////

function padStartEpisodes(season, episode) {
  if (season < 10) {
    season = season.toString().padStart(2, "0");
  }
  if (episode < 10) {
    episode = episode.toString().padStart(2, "0");
  }
  let seasonEpisode = `-S${season}E${episode}`;
  return seasonEpisode;
}

let list;

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
    showAllCards(list);
    createDropDownList();
  } catch (error) {
    console.log("an error happened during fetching the data", error.message);
    popupError(error.message);
  }
});

//comment to start level 200 by bkarimi

const dropDown = document.querySelector("#episode-drop-down");
function createDropDownList() {
  for (let item of list) {
    const option = document.createElement("option");
    const episode = padStartEpisodes(item.season, item.number);
    option.value = `${item.name}${episode}`;
    option.textContent = `${item.name}${episode}`;
    dropDown.appendChild(option);
  }
}

dropDown.addEventListener("change", () => {
  const dropDownValue = dropDown.value;
  const foundItem = list.find((episode) => {
    const elementTitle = `${episode.name}${padStartEpisodes(
      episode.season,
      episode.number
    )}`;
    return elementTitle === dropDownValue;
  });
  document.getElementById("root").innerHTML = "";
  if (foundItem) {
    showCard(foundItem);
  } else {
    showAllCards(list);
  }
});

///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
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
