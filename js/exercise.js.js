const params = new URLSearchParams(window.location.search);
const slug = params.get("ex");

const nameEl = document.getElementById("ex-name");
const descEl = document.getElementById("ex-desc");
const gifEl = document.getElementById("ex-gif");
const timerEl = document.getElementById("timer-display");
const pauseBtn = document.getElementById("pause-btn");
const nextBtn = document.getElementById("next-btn");

let time = 45;
let running = true;

function formatTime(t) {
  const m = String(Math.floor(t / 60)).padStart(2, "0");
  const s = String(t % 60).padStart(2, "0");
  return `${m}:${s}`;
}

timerEl.textContent = formatTime(time);

firebase.database().ref("exercises").orderByChild("slug").equalTo(slug).once("value")
  .then(snap => {
    const val = snap.val();
    if (!val) {
      nameEl.textContent = "Esercizio non trovato";
      return;
    }
    const key = Object.keys(val)[0];
    const ex = val[key];

    nameEl.textContent = ex.name || slug;
    descEl.textContent = ex.description || "Mantieni la forma corretta per tutta la durata dell'esercizio.";
    gifEl.src = ex.gifUrl || "/assets/gif/default.gif";
  });

setInterval(() => {
  if (!running) return;
  if (time <= 0) return;
  time--;
  timerEl.textContent = formatTime(time);
}, 1000);

pauseBtn.onclick = () => {
  running = !running;
  pauseBtn.textContent = running ? "Pausa" : "Riprendi";
};

nextBtn.onclick = () => {
  // qui potrai gestire il passaggio al prossimo esercizio
  alert("Esercizio completato!");
};
