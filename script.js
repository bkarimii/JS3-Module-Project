//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

window.onload = setup;

function createStructure() {
  const card = document.createElement("section");

  const filmTitle = document.createElement("h3");
  filmTitle.textContent = film.filmTitle;

  const filmDirector = document.createElement("p");
  filmDirector.textContent = film.filmDirector;
}
