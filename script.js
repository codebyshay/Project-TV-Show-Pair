const showSelect = document.getElementById("showSelect");
// Store shows + cache
let allShows = [];
const episodeCache = {};

// Get references to page elements
const root = document.getElementById("root");
const searchInput = document.getElementById("searchInput");
const resultsCount = document.getElementById("resultsCount");
const episodeSelect = document.getElementById("episodeSelect");

// Store all episodes so we can filter without re-fetching
let allEpisodes = [];

// Show a loading message while episodes are being fetched
root.innerHTML = "<p>Loading episodes... please wait</p>";

// Fetch all episodes from TVMaze API once on page load
async function loadEpisodes() {
  try {
    // Send a request to the TVMaze API
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    // If the server returns an error, throw a trigger to catch block
    if (!response.ok) {
      throw new Error("Failed to fetch episodes");
    }
    // Parse the response as JSON
    const episodes = await response.json();
    // Save episodes so we can filter later with re-fetching
    allEpisodes = episodes;
    // Populate the dropdown and render all episode cards
    populateDropdown(allEpisodes);
    displayEpisodes(allEpisodes);
  } catch {
    // Show a user-friendly error message if the fetch fails
    root.innerHTML =
      "<p>Something went wrong loading episodes. Please try again later.</p>";
  }
}

// Filter episodes on every keystroke and update the display
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();

  const filtered = allEpisodes.filter((ep) => {
    const name = ep.name.toLowerCase();
    const summary = (ep.summary || "").toLowerCase();

    return name.includes(searchTerm) || summary.includes(searchTerm);
  });

  displayEpisodes(filtered);
});

// Render episode cards and update the results count
function displayEpisodes(episodes) {
  root.innerHTML = "";

  resultsCount.textContent = `Displaying ${episodes.length} / ${allEpisodes.length} episodes`;

  episodes.forEach((ep) => {
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

// Build the episode selector dropdown with all episodes
function populateDropdown(episodes) {
  episodeSelect.innerHTML = `<option value="">All Episodes</option>`;

  episodes.forEach((ep) => {
    const option = document.createElement("option");

    const code = formatEpisodeCode(ep.season, ep.number);

    option.value = ep.id;
    option.textContent = `${code} - ${ep.name}`;

    episodeSelect.appendChild(option);
  });
}

// Show only the selected episode,
// or all episodes if "All Episodes" is chosen
episodeSelect.addEventListener("change", () => {
  const selectedId = episodeSelect.value;

  if (!selectedId) {
    // Displays all episodes when "All Episodes" is selected
    displayEpisodes(allEpisodes);
    return;
  }

  // Find the selected episode and display only that one
  const selectedEpisode = allEpisodes.filter(
    (ep) => ep.id === Number(selectedId),
  );
  displayEpisodes(selectedEpisode);
});

// Format season and episode numbers as S01E01
function formatEpisodeCode(season, number) {
  const s = String(season).padStart(2, "0");
  const e = String(number).padStart(2, "0");
  return `S${s}E${e}`;
}

// Start the app on page load
async function loadShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");

    if (!response.ok) {
      throw new Error("Failed to fetch shows");
    }

    const shows = await response.json();

    // Sort alphabetically (case-insensitive)
    allShows = shows.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    populateShowDropdown(allShows);

  } catch (error) {
    root.innerHTML = "<p>❌ Failed to load shows</p>";
    console.error(error);
  }
}
function populateShowDropdown(shows) {
  showSelect.innerHTML = `<option value="">Select a show...</option>`;

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelect.appendChild(option);
  });

   // ✅ AUTO-LOAD FIRST SHOW
  if (shows.length > 0) {
    showSelect.value = shows[0].id;
    showSelect.dispatchEvent(new Event("change"));
  }
}
showSelect.addEventListener("change", async () => {
  const showId = showSelect.value;

  if (!showId) return;

  // Use cache if already fetched
  if (episodeCache[showId]) {
    allEpisodes = episodeCache[showId];
    populateDropdown(allEpisodes);
    displayEpisodes(allEpisodes);
    return;
  }

  root.innerHTML = "<p>Loading episodes... ⏳</p>";

  try {
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch episodes");
    }

    const episodes = await response.json();

    episodeCache[showId] = episodes; // cache it
    allEpisodes = episodes;

    populateDropdown(allEpisodes);
    displayEpisodes(allEpisodes);

  } catch {
    root.innerHTML =
      "<p>Something went wrong loading episodes. Please try again later.</p>";
  }
});
loadShows();

