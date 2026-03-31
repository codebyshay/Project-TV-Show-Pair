//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  // Get the root element where all episode cards will be added
  const rootElement = document.getElementById("root");
  // Clear any existing content
  rootElement.innerHTML = "";

  // Loop through every episode in the list
  for (let i = 0; i < episodeList.length; i++) {
    // Get the current episode
    const episode = episodeList[i];
    // Zero-pad the season and episode numbers to 2 digits
    const seasonCode = String(episode.season).padStart(2, "0");
    const episodeCode = String(episode.number).padStart(2, "0");
    // Create a new div element for the episode card
    const episodeDiv = document.createElement("div");

    // Fill the card with the episode's name, code, image and summary
    episodeDiv.innerHTML = ` 
    <div class="episode-header">
    <h3>${episode.name} - S${seasonCode}E${episodeCode}</h3>
    </div>
    <img src="${episode.image.medium}" alt="${episode.name}">
    <p>${episode.summary}</p>
    `;
    // Add a class to the card for styling
    episodeDiv.classList.add("episode-card");
    // Add the card to the page
    rootElement.appendChild(episodeDiv);
  }
}

window.onload = setup;
