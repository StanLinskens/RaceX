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
	{ name: "red", img: "../../assets/image/racers/red-racer-pixilart.png" },
	{ name: "blue", img: "../../assets/image/racers/blue-racer-pixilart.png" },
	{ name: "green", img: "../../assets/image/racers/green-racer-pixilart.png" },
	{ name: "yellow", img: "../../assets/image/racers/yellow-racer-pixilart.png" },
	{ name: "pink", img: "../../assets/image/racers/pink-racer-pixilart.png" },
	{ name: "orange", img: "../../assets/image/racers/orange-racer-pixilart.png" },
	{ name: "alt-red", img: "../../assets/image/racers/alt-red-racer-pixilart.png" },
	{ name: "alt-blue", img: "../../assets/image/racers/alt-blue-racer-pixilart.png" },
	{ name: "crimson", img: "../../assets/image/racers/crimson-racer-pixilart.png" },
	{ name: "dino", img: "../../assets/image/racers/dino-racer-pixilart.png" },
	{ name: "dragon", img: "../../assets/image/racers/dragon-racer-pixilart.png" },
	{ name: "grey", img: "../../assets/image/racers/grey-racer-pixilart.png" },
	{ name: "pepper", img: "../../assets/image/racers/pepper-racer-pixilart.png" },
	{ name: "toxic", img: "../../assets/image/racers/toxic-racer-pixilart.png" },
	{ name: "white", img: "../../assets/image/racers/white-racer-pixilart.png" }
];

const racerOptions = document.getElementById("racer-options");
const track = document.getElementById("track");
const resultsList = document.getElementById("race-results");

let racers = []; // active racers for the current game

function loadRacers() {
	racerOptions.innerHTML = "";
	track.innerHTML = "";
	racers = [];

	// Shuffle the racer pool and pick the first N
	const shuffled = allRacers.sort(() => 0.5 - Math.random());
	const chosenRacers = shuffled.slice(0, gameSettings.racers);

	chosenRacers.forEach((r, i) => {
		// Create racer option in selection panel
		const option = document.createElement("div");
		option.textContent = r.name;
		option.classList.add("racer-option");
		racerOptions.appendChild(option);

		// Create racer image on track
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