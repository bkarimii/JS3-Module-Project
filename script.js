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

function showCard() {
  const list = getAllEpisodes();

  for (let item of list) {
    const temp = document.getElementById("film-card");
    const card = temp.content.cloneNode(true);
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
    filmSummary.innerHTML = `<summary>Movie summary:</summary> +${item.summary}`;

    const rootDiv = document.getElementById("root");
    rootDiv.appendChild(card);
  }
}
showCard();
