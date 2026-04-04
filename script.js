// Page elements
const root = document.getElementById("root");
const searchInput = document.getElementById("searchInput");
const resultsCount = document.getElementById("resultsCount");
const episodeSelect = document.getElementById("episodeSelect");

// Store all episodes
let allEpisodes = [];

// Load episodes from provided data
function setup() {
  allEpisodes = getAllEpisodes();

  populateDropdown(allEpisodes);
  displayEpisodes(allEpisodes);
}

// 🔎 Live search
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();

  const filtered = allEpisodes.filter(ep => {
    const name = ep.name.toLowerCase();
    const summary = (ep.summary || "").toLowerCase();

    return name.includes(searchTerm) || summary.includes(searchTerm);
  });

  displayEpisodes(filtered);
});

// 📺 Display episodes
function displayEpisodes(episodes) {
  root.innerHTML = "";

  resultsCount.textContent = `Displaying ${episodes.length} / ${allEpisodes.length} episodes`;

  episodes.forEach(ep => {
    const episodeCode = formatEpisodeCode(ep.season, ep.number);

    const div = document.createElement("div");
    div.className = "episode-card";
    div.id = `episode-${ep.id}`;

    div.innerHTML = `
      <div class="episode-header">
        <h3>${episodeCode} - ${ep.name}</h3>
      </div>
      <img src="${ep.image?.medium || ""}" alt="${ep.name}">
      <p>${(ep.summary || "").replace(/<[^>]+>/g, "")}</p>
    `;

    root.appendChild(div);
  });
}

// 🔽 Populate dropdown
function populateDropdown(episodes) {
  episodeSelect.innerHTML = `<option value="">All Episodes</option>`;

  episodes.forEach(ep => {
    const option = document.createElement("option");

    const code = formatEpisodeCode(ep.season, ep.number);

    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;

    episodeSelect.appendChild(option);
  });
}

// 🎯 Jump to episode
episodeSelect.addEventListener("change", () => {
  const selectedId = episodeSelect.value;

  if (!selectedId) {
    displayEpisodes(allEpisodes);
    return;
  }

  const element = document.getElementById(`episode-${selectedId}`);

  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
});

// 🔢 Format SxxExx
function formatEpisodeCode(season, number) {
  const s = String(season).padStart(2, "0");
  const e = String(number).padStart(2, "0");
  return `S${s}E${e}`;
}

// Run setup
window.onload = setup;