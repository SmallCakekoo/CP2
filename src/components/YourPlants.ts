import { store } from "../flux/Store";
import getPlants from "../services/Plants";
import { Plants } from "../types/ApiTypes";

class YourPlants extends HTMLElement {
  private plants: Plants[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    store.subscribe(this.handleStateChange.bind(this));
    await this.loadPlants();
  }

  private async loadPlants() {
    try {
      this.plants = await getPlants();
      this.render();
    } catch (error) {
      console.error("Error loading plants:", error);
    }
  }

  private handleStateChange = async () => {
    await this.render();
  };

  async render() {
    if (!this.shadowRoot) return;

    const state = store.getState();
    const addedPlants = state.addedPlants || [];

    const yourPlants = this.plants.filter((plant) =>
      addedPlants.includes(plant.id)
    );

    this.shadowRoot.innerHTML = `
      <style>
        .yourplants-container {
          padding: 2rem;
        }
        .yourplants-title {
          text-align: center;
          color: #333;
          margin-bottom: 1rem;
        }
        .plants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .plant-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }
        .plant-card img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 4px;
        }
        .plant-card h4 {
          margin: 0.5rem 0;
          color: #333;
        }
        .no-plants {
          text-align: center;
          color: #666;
          padding: 2rem;
        }
      </style>
      
      <div class="yourplants-container">
        <h2 class="yourplants-title">Tu Jardín Virtual</h2>
        ${
          yourPlants.length > 0
            ? `
          <div class="plants-grid">
            ${yourPlants
              .map(
                (plant) => `
              <div class="plant-card">
                <img src="${plant.img}" alt="${plant.commonName}" />
                <h4>${plant.commonName}</h4>
              </div>
            `
              )
              .join("")}
          </div>
        `
            : `
          <div class="no-plants">
            <p>Aún no has añadido plantas a tu jardín</p>
          </div>
        `
        }
      </div>
    `;
  }
}

export default YourPlants;
