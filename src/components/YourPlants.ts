import { store } from "../flux/Store";
import { StoreActions } from "../flux/Actions";

class YourPlants extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    store.subscribe(this.handleStateChange.bind(this));

    // Cargar las plantas si no están ya cargadas
    const state = store.getState();
    if (!state.plants || state.plants.length === 0) {
      await StoreActions.loadPlants();
    }

    this.render();
  }

  disconnectedCallback() {
    store.unsubscribe(this.handleStateChange.bind(this));
  }

  private handleStateChange = () => {
    this.render();
  };

  private handleGardenNameChange(event: Event) {
    const input = event.target as HTMLInputElement;
    StoreActions.updateGardenName(input.value);
  }

  async render() {
    if (!this.shadowRoot) return;

    const state = store.getState();
    const addedPlants = state.addedPlants || [];
    const plants = state.plants || [];
    const gardenName = state.gardenName || "Mi Jardín Virtual";

    let yourPlants = plants.filter((plant, index) =>
      addedPlants.includes(index + 1)
    );

    yourPlants = yourPlants.sort((a, b) =>
      a.common_name.localeCompare(b.common_name)
    );

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        :host {
          --color-green-dark: #1b5e20;
          --color-green-medium: #2e7d32;
          --color-green-light: #4caf50;
          --color-green-pale: #a5d6a7;
          --color-green-bg: #f1f8e9;
          --color-text-dark: #263238;
          --color-text-medium: #546e7a;
          --color-text-light: #78909c;
        }
        
        * {
          font-family: 'Montserrat', sans-serif;
        }
        
        .yourplants-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background-color: var(--color-green-bg);
          border-radius: 15px;
          box-shadow: var(--shadow-sm);
        }
        
        .yourplants-header {
          text-align: center;
          margin-bottom: 3rem;
          padding: 1.5rem;
        }
        
        .yourplants-title {
          color: var(--color-green-dark);
          font-size: 2.5rem;
          margin-bottom: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .garden-name-input {
          font-size: 2.5rem;
          color: var(--color-green-dark);
          font-weight: 700;
          background: transparent;
          border: none;
          border-bottom: 2px dashed transparent;
          text-align: center;
          padding: 0 10px;
          transition: border-color 0.3s;
          margin: 0 10px;
          font-family: 'Montserrat', sans-serif;
        }
        
        .garden-name-input:focus {
          outline: none;
          border-bottom: 2px dashed var(--color-green-medium);
        }
        
        .garden-name-input:hover {
          border-bottom: 2px dashed var(--color-green-medium);
        }
        
        .yourplants-subtitle {
          color: var(--color-text-medium);
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto;
          font-weight: 400;
        }
        
        .plants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 2rem;
        }
        
        .plant-card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          background-color: #fff;
        }
        
        .plant-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .plant-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .plant-card:hover .plant-img {
          transform: scale(1.05);
        }
        
        .plant-info {
          padding: 1.5rem;
        }
        
        .plant-name {
          margin: 0;
          font-size: 1.3rem;
          color: var(--color-green-dark);
          font-weight: 600;
        }
        
        .plant-scientific-name {
          margin: 0.5rem 0 0 0;
          font-size: 0.9rem;
          color: var(--color-text-medium);
          font-style: italic;
        }
        
        .plant-type {
          margin: 0.5rem 0 0 0;
          font-size: 0.9rem;
          color: var(--color-text-medium);
        }
        
        .no-plants {
          text-align: center;
          color: var(--color-text-medium);
          padding: 4rem 2rem;
          background-color: #fff;
          border-radius: 12px;
          margin-top: 1rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        
        .no-plants-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          color: var(--color-green-pale);
        }
        
        .no-plants-text {
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          color: var(--color-text-dark);
        }
        
        .add-plants-btn {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          background-color: var(--color-green-medium);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          font-size: 1rem;
          transition: background-color 0.3s, transform 0.3s;
          cursor: pointer;
        }
        
        .add-plants-btn:hover {
          background-color: var(--color-green-dark);
          transform: translateY(-3px);
        }
        
        @media (max-width: 768px) {
          .plants-grid {
            grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
            gap: 1.5rem;
          }
          .yourplants-container {
            padding: 1.5rem;
          }
          .garden-name-input {
            font-size: 2rem;
          }
        }
      </style>
      
      <div class="yourplants-container">
        <div class="yourplants-header">
          <div class="yourplants-title">
            <input class="garden-name-input" type="text" value="${gardenName}" placeholder="Nombre de tu jardín">
          </div>
          <p class="yourplants-subtitle">Aquí podrás ver todas las plantas que has seleccionado para tu jardín</p>
        </div>
        
        ${
          yourPlants.length > 0
            ? `
          <div class="plants-grid">
            ${yourPlants
              .map(
                (plant) => `
              <div class="plant-card">
                <img class="plant-img" src="${plant.img}" alt="${plant.common_name}" />
                <div class="plant-info">
                  <h4 class="plant-name">${plant.common_name}</h4>
                  <p class="plant-scientific-name">${plant.scientific_name}</p>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        `
            : `
          <div class="no-plants">
            <div class="no-plants-icon">🌿</div>
            <p class="no-plants-text">Aún no has añadido plantas a tu jardín.</p>
            <button id="add-plants-btn" class="add-plants-btn">Explorar catálogo</button>
          </div>
        `
        }
      </div>
    `;

    const gardenNameInput = this.shadowRoot.querySelector(".garden-name-input");
    if (gardenNameInput) {
      gardenNameInput.addEventListener("change", this.handleGardenNameChange);
    }

    const addPlantsBtn = this.shadowRoot.querySelector("#add-plants-btn");
    if (addPlantsBtn) {
      addPlantsBtn.addEventListener("click", () => {
        StoreActions.navigate("modifyGarden");
      });
    }
  }
}

export default YourPlants;
