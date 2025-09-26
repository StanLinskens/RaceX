// =====================
// TAB SWITCHING
// =====================
const tabs = document.querySelectorAll("nav button");
const sections = document.querySelectorAll("main .tab");

tabs.forEach(button => {
	button.addEventListener("click", () => {
		const target = button.dataset.tab;

		sections.forEach(section => section.classList.remove("active"));
		document.getElementById(target).classList.add("active");
	});
});

// =====================
// SETTINGS
// =====================
let gameSettings = {
	racers: 2,
	minSpeed: 1,
	maxSpeed: 10,
	speedFrequency: 150
};

const settingsForm = document.getElementById("settings-form");
settingsForm.addEventListener("submit", (e) => {
	e.preventDefault();

	gameSettings.racers = parseInt(document.getElementById("racers-count").value);
	gameSettings.minSpeed = parseInt(document.getElementById("min-speed").value);
	gameSettings.maxSpeed = parseInt(document.getElementById("max-speed").value);
	gameSettings.speedFrequency = parseInt(document.getElementById("speed-frequency").value);

	alert("✅ Settings saved!");
});

// =====================
// RACER REGISTRY
// =====================
// Add all your racer names here
const allRacers = [
	{ name: "red", img: "assets/image/racers/red-racer-pixilart.png" },
	{ name: "blue", img: "assets/image/racers/blue-racer-pixilart.png" },
	{ name: "green", img: "assets/image/racers/green-racer-pixilart.png" },
	{ name: "yellow", img: "assets/image/racers/yellow-racer-pixilart.png" },
	{ name: "pink", img: "assets/image/racers/pink-racer-pixilart.png" },
	{ name: "orange", img: "assets/image/racers/orange-racer-pixilart.png" },
	{ name: "alt-red", img: "assets/image/racers/alt-red-racer-pixilart.png" },
	{ name: "alt-blue", img: "assets/image/racers/alt-blue-racer-pixilart.png" },
	{ name: "crimson", img: "assets/image/racers/crimson-racer-pixilart.png" },
	{ name: "dino", img: "assets/image/racers/dino-racer-pixilart.png" },
	{ name: "dragon", img: "assets/image/racers/dragon-racer-pixilart.png" },
	{ name: "grey", img: "assets/image/racers/grey-racer-pixilart.png" },
	{ name: "pepper", img: "assets/image/racers/pepper-racer-pixilart.png" },
	{ name: "toxic", img: "assets/image/racers/toxic-racer-pixilart.png" },
	{ name: "white", img: "assets/image/racers/white-racer-pixilart.png" }
];

const racerOptions = document.getElementById("racer-options");
const track = document.getElementById("track");
const resultsList = document.getElementById("race-results");

let racers = []; // active racers for the current game

const racerSelect = document.getElementById("racer-select");
const selectedRacersBox = document.getElementById("selected-racers");
const addRacerBtn = document.getElementById("add-racer-btn");

// Populate dropdown with all racers
function loadRacerDropdown() {
  racerSelect.innerHTML = '<option value="">-- Select a racer --</option>';
  allRacers.forEach(r => {
    const option = document.createElement("option");
    option.value = r.name;
    option.textContent = r.name;
    racerSelect.appendChild(option);
  });
}

// Store chosen racers here
let manualChosenRacers = [];

addRacerBtn.addEventListener("click", () => {
  const value = racerSelect.value;
  if (!value) return;

  // Prevent duplicates
  if (manualChosenRacers.some(r => r.name === value)) {
    alert("⚠️ Racer already selected!");
    return;
  }

  // Respect racer count setting
  if (manualChosenRacers.length >= gameSettings.racers) {
    alert(`⚠️ Maximum of ${gameSettings.racers} racers allowed!`);
    return;
  }

  const racerData = allRacers.find(r => r.name === value);

  // Add to chosen list
  manualChosenRacers.push(racerData);

  // Render preview box
  const card = document.createElement("div");
  card.classList.add("racer-card");

  card.innerHTML = `
    <img src="${racerData.img}" alt="${racerData.name}">
    <span>${racerData.name}</span>
    <button type="button" class="remove-racer">✖</button>
  `;

  // Remove button
  card.querySelector(".remove-racer").addEventListener("click", () => {
    manualChosenRacers = manualChosenRacers.filter(r => r.name !== racerData.name);
    card.remove();
  });

  selectedRacersBox.appendChild(card);
});

// Use manualChosenRacers in loadRacers()
function loadRacers() {
  track.innerHTML = "";
  racers = [];

  if (manualChosenRacers.length === 0) {
    alert("⚠️ Please select racers in settings first!");
    return;
  }

  manualChosenRacers.forEach((r, i) => {
    const racerImg = document.createElement("img");
    racerImg.src = r.img;
    racerImg.classList.add("racer");
    racerImg.style.top = `${50 * i + 20}px`;
    racerImg.style.left = "0px";

    track.appendChild(racerImg);

    racers.push({
      name: r.name,
      element: racerImg,
      position: 0,
      speed: 0
    });
  });
}

function loadRacerOptions() {
	racerOptions.innerHTML = "";

	allRacers.forEach(r => {
		const option = document.createElement("label");
		option.classList.add("racer-option");

		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.value = r.name;

		const img = document.createElement("img");
		img.src = r.img;
		img.alt = r.name;
		img.classList.add("racer-preview");

		const nameInput = document.createElement("input");
		nameInput.type = "text";
		nameInput.placeholder = r.name;
		nameInput.dataset.original = r.name; // keep link to image

		option.appendChild(checkbox);
		option.appendChild(img);
		option.appendChild(nameInput);

		racerOptions.appendChild(option);
	});
}
// Initialize dropdown on load
document.addEventListener("DOMContentLoaded", loadRacerDropdown);
document.addEventListener("DOMContentLoaded", loadRacerOptions);

// =====================
// RACE LOGIC
// =====================
let raceInterval = null;
let raceCount = 1; // Track which race number we are on
const startRaceBtn = document.getElementById("start-race");

startRaceBtn.addEventListener("click", () => {
	// Prevent multiple races at once
	if (raceInterval) return;

	// Create a new race container for this race
	const raceContainer = document.createElement("div");
	raceContainer.classList.add("race-result-container");

	// Heading for this race
	const raceHeading = document.createElement("h3");
	raceHeading.textContent = `Race ${raceCount}`;
	raceContainer.appendChild(raceHeading);

	// List to hold results for this race
	const raceList = document.createElement("ol");
	raceContainer.appendChild(raceList);

	// Append the race container to the results div
	resultsList.appendChild(raceContainer);

	loadRacers(); // reset racers for the new race

	const trackWidth = track.offsetWidth - 60;
	let finished = [];

	raceInterval = setInterval(() => {
		racers.forEach(racer => {
			// random speed between min and max
			racer.speed = Math.floor(
				Math.random() * (gameSettings.maxSpeed - gameSettings.minSpeed + 1)
			) + gameSettings.minSpeed;

			racer.position += racer.speed;
			if (racer.position > trackWidth) {
				racer.position = trackWidth;
			}

			racer.element.style.left = racer.position + "px";

			// check finish
			if (racer.position >= trackWidth && !finished.includes(racer.name)) {
				finished.push(racer.name);

				// Add racer to the ordered list (numbered automatically)
				const li = document.createElement("li");
				li.textContent = racer.name;
				raceList.appendChild(li);

				// Stop race when all finish
				if (finished.length === racers.length) {
					clearInterval(raceInterval);
					raceInterval = null;
					raceCount++; // increment for next race
				}
			}
		});
	}, gameSettings.speedFrequency);
});