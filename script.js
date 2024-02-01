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
const arr = [
  {
    id: 4952,
    url: "http://www.tvmaze.com/episodes/4952/game-of-thrones-1x01-winter-is-coming",
    name: "Winter is Coming",
    season: 1,
    number: 1,
    airdate: "2011-04-17",
    airtime: "21:00",
    airstamp: "2011-04-18T01:00:00+00:00",
    runtime: 60,
    image: {
      medium:
        "http://static.tvmaze.com/uploads/images/medium_landscape/1/2668.jpg",
      original:
        "http://static.tvmaze.com/uploads/images/original_untouched/1/2668.jpg",
    },
    summary:
      "<p>Lord Eddard Stark, ruler of the North, is summoned to court by his old friend, King Robert Baratheon, to serve as the King's Hand. Eddard reluctantly agrees after learning of a possible threat to the King's life. Eddard's bastard son Jon Snow must make a painful decision about his own future, while in the distant east Viserys Targaryen plots to reclaim his father's throne, usurped by Robert, by selling his sister in marriage.</p>",
    _links: {
      self: {
        href: "http://api.tvmaze.com/episodes/4952",
      },
    },
  },
  {
    id: 4953,
    url: "http://www.tvmaze.com/episodes/4953/game-of-thrones-1x02-the-kingsroad",
    name: "The Kingsroad",
    season: 1,
    number: 2,
    airdate: "2011-04-24",
    airtime: "21:00",
    airstamp: "2011-04-25T01:00:00+00:00",
    runtime: 60,
    image: {
      medium:
        "http://static.tvmaze.com/uploads/images/medium_landscape/1/2669.jpg",
      original:
        "http://static.tvmaze.com/uploads/images/original_untouched/1/2669.jpg",
    },
    summary:
      "<p>An incident on the Kingsroad threatens Eddard and Robert's friendship. Jon and Tyrion travel to the Wall, where they discover that the reality of the Night's Watch may not match the heroic image of it.</p>",
    _links: {
      self: {
        href: "http://api.tvmaze.com/episodes/4953",
      },
    },
  },
];

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

const list = getAllEpisodes();

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
function showAllCards() {
  for (let item of list) {
    showCard(item);
  }
}
showAllCards();

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
createDropDownList();

dropDown.addEventListener("change", () => {
  const dropDownValue = dropDown.value;
  console.log(dropDownValue);
  list.forEach((element) => {
    const elementTitle = `${element.name}${padStartEpisodes(
      element.season,
      element.number
    )}`;

    //cloning template inside the html

    if (dropDownValue === "") {
      showAllCards();
    } else if (elementTitle == dropDownValue) {
      document.getElementById("root").innerHTML = "";
      showCard(element);
    }
  });
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
    showAllCards();
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
