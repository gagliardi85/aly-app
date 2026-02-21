// Simulazione esercizi generati dall'AI (in produzione li leggerai dal DB)
const mockExercises = [
  { id: "ex1", name: "Plank Laterale" },
  { id: "ex2", name: "Bridge Glutei" },
  { id: "ex3", name: "Dead Bug Core" }
];

const listEl = document.getElementById("exercise-list");

function toSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w_]/g, "");
}

function renderExercises(exercises) {
  listEl.innerHTML = "";
  exercises.forEach(ex => {
    const wrapper = document.createElement("div");
    wrapper.className = "exercise-item";

    wrapper.innerHTML = `
      <div class="exercise-top">
        <span class="exercise-label">Nome esercizio</span>
        <input type="text" class="exercise-name-input" data-id="${ex.id}" value="${ex.name}">
      </div>
      <div class="exercise-actions">
        <button class="btn-small btn-save" data-id="${ex.id}">Salva</button>
        <button class="btn-small btn-upload" data-id="${ex.id}">Carica GIF</button>
      </div>
    `;

    listEl.appendChild(wrapper);
  });

  attachEvents();
}

function attachEvents() {
  document.querySelectorAll(".btn-save").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const input = document.querySelector(`.exercise-name-input[data-id="${id}"]`);
      const newName = input.value;
      const slug = toSlug(newName);

      // Salva nel DB (qui esempio Realtime Database)
      await firebase.database().ref("exercises/" + id).update({
        name: newName,
        slug: slug,
        gifUrl: `/assets/gif/${slug}.gif`
      });

      alert("Nome esercizio aggiornato e collegato alla GIF: " + slug + ".gif");
    };
  });

  document.querySelectorAll(".btn-upload").forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      const input = document.querySelector(`.exercise-name-input[data-id="${id}"]`);
      const slug = toSlug(input.value);

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/gif";

      fileInput.onchange = async () => {
        const file = fileInput.files[0];
        if (!file) return;

        const storageRef = firebase.storage().ref(`/assets/gif/${slug}.gif`);
        await storageRef.put(file);

        // Aggiorna gifUrl nel DB
        await firebase.database().ref("exercises/" + id).update({
          gifUrl: `/assets/gif/${slug}.gif`
        });

        alert("GIF caricata come " + slug + ".gif");
      };

      fileInput.click();
    };
  });
}

// In produzione: leggi dal DB, qui mock
renderExercises(mockExercises);
