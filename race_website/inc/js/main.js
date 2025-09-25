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
  speedFrequency: 500
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
  { name: "flash", img: "../../assets/image/racers/red-racer-pixilart.png" },
  { name: "blaze", img: "../../assets/image/racers/blue-racer-pixilart.png" },
  { name: "storm", img: "../../assets/image/racers/green-racer-pixilart.png" },
  { name: "shadow", img: "../../assets/image/racers/yellow-racer-pixilart.png" },
  { name: "viper", img: "../../assets/image/racers/pink-racer-pixilart.png" },
  { name: "bolt", img: "../../assets/image/racers/orange-racer-pixilart.png" }
];

const racerOptions = document.getElementById("racer-options");
const track = document.getElementById("track");
const resultsList = document.getElementById("race-results");

let racers = []; // active racers for the current game

function loadRacers() {
  racerOptions.innerHTML = "";
  track.innerHTML = "";
  racers = [];

  // Limit to selected number of racers
  const chosenRacers = allRacers.slice(0, gameSettings.racers);

  chosenRacers.forEach((r, i) => {
    // Create racer option in side panel
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
const startRaceBtn = document.getElementById("start-race");

startRaceBtn.addEventListener("click", () => {
  resultsList.innerHTML = "";
  loadRacers(); // reset racers before race

  const trackWidth = track.offsetWidth - 60; // finish line (minus racer width)
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

        const li = document.createElement("li");
        li.textContent = `${finished.length}. ${racer.name}`;
        resultsList.appendChild(li);

        if (finished.length === racers.length) {
          clearInterval(raceInterval);
        }
      }
    });
  }, gameSettings.speedFrequency);
});