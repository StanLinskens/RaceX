// =====================
// TAB SWITCHING
// =====================
const tabs = document.querySelectorAll("nav button");
const sections = document.querySelectorAll("main .tab");

tabs.forEach(button => {
  button.addEventListener("click", () => {
    const target = button.dataset.tab;

    sections.forEach(section => {
      section.classList.remove("active");
    });

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
// RACER GENERATION
// =====================
const racerOptions = document.getElementById("racer-options");
const track = document.getElementById("track");
const resultsList = document.getElementById("race-results");

let racers = []; // store racer objects

function loadRacers() {
  racerOptions.innerHTML = "";
  track.innerHTML = "";
  racers = [];

  for (let i = 1; i <= gameSettings.racers; i++) {
    // create racer choice (in selection panel)
    const option = document.createElement("div");
    option.textContent = `Racer ${i}`;
    option.classList.add("racer-option");
    racerOptions.appendChild(option);

    // create racer on track
    const racerImg = document.createElement("img");
    racerImg.src = `../../assets/image/racers/${i}-racer-pixilart.png`; // <-- your file path
    racerImg.classList.add("racer");
    racerImg.style.top = `${50 * i}px`; // spacing
    racerImg.style.left = `0px`;

    track.appendChild(racerImg);

    racers.push({
      id: i,
      element: racerImg,
      position: 0,
      speed: 0
    });
  }
}

// =====================
// RACE LOGIC
// =====================
let raceInterval = null;
const startRaceBtn = document.getElementById("start-race");

startRaceBtn.addEventListener("click", () => {
  resultsList.innerHTML = "";
  loadRacers(); // refresh racers before race

  const trackWidth = track.offsetWidth - 60; // finish line (minus racer width)
  let finished = [];

  // update racer speeds periodically
  raceInterval = setInterval(() => {
    racers.forEach(racer => {
      // random speed within range
      racer.speed = Math.floor(
        Math.random() * (gameSettings.maxSpeed - gameSettings.minSpeed + 1)
      ) + gameSettings.minSpeed;

      racer.position += racer.speed;
      if (racer.position > trackWidth) {
        racer.position = trackWidth;
      }

      racer.element.style.left = racer.position + "px";

      // check finish
      if (racer.position >= trackWidth && !finished.includes(racer.id)) {
        finished.push(racer.id);
        const li = document.createElement("li");
        li.textContent = `Racer ${racer.id}`;
        resultsList.appendChild(li);

        // stop when all finish
        if (finished.length === gameSettings.racers) {
          clearInterval(raceInterval);
        }
      }
    });
  }, gameSettings.speedFrequency);
});
