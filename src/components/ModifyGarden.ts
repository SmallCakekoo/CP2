import { store } from "../flux/Store";
import getPlants from "../services/Plants";
import { Plants } from "../types/ApiTypes";
import { AddActions } from "../flux/Actions";

class ModifyGarden extends HTMLElement {
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

  private handleTogglePlant(plantId: string) {
    AddActions.toggleLike(plantId);
  }

  async render() {
    if (!this.shadowRoot) return;

    const state = store.getState();
    const addedPlants = state.addedPlants || [];

    this.shadowRoot.innerHTML = `
      <style>
        .modify-garden-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .modify-garden-title {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
        }
        .plants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .plant-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          transition: transform 0.2s;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .plant-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .plant-card img {
          width: 200px;
          height: 200px;
          object-fit: cover;
          border-radius: 4px;
        }
        .plant-card h3 {
          margin: 0.5rem 0;
          color: #333;
        }
        .plant-card p {
          color: #666;
          font-size: 0.9rem;
          margin: 0.3rem 0;
        }
        .plant-card button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .plant-card button.remove {
          background-color: #f44336;
        }
        .plant-card button:hover {
          opacity: 0.9;
        }
        .back-button {
          display: inline-block;
          margin-bottom: 1rem;
          padding: 0.5rem 1rem;
          background-color: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          text-decoration: none;
        }
      </style>
      
      <div class="modify-garden-container">
        <button class="back-button" id="backBtn">Volver al inicio</button>
        <h2 class="modify-garden-title">Modificar Mi Jardín Virtual</h2>
        <div class="plants-grid">
          ${this.plants
            .map((plant, index) => {
              const plantId = index + 1;
              return `
              <div class="plant-card">
                <img src="${plant.img}" alt="${plant.common_name}">
                <h3>${plant.common_name}</h3>
                <p>${plant.scientific_name}</p>
                <p>Tipo: ${plant.type}</p>
                <p>Origen: ${plant.origin}</p>
                <button class="${
                  addedPlants.includes(plantId) ? "remove" : ""
                }" data-id="${plantId}">
                  ${
                    addedPlants.includes(plantId)
                      ? "Quitar del jardín"
                      : "Añadir al jardín"
                  }
                </button>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;

    // Agregar listeners a los botones
    this.shadowRoot.querySelectorAll("button[data-id]").forEach((button) => {
      button.addEventListener("click", (e) => {
        const plantId = (e.target as HTMLElement).getAttribute("data-id");
        if (plantId) {
          this.handleTogglePlant(plantId);
        }
      });
    });

    // Listener para el botón de volver
    const backBtn = this.shadowRoot.querySelector("#backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        this.dispatchEvent(
          new CustomEvent("navigate", {
            detail: { page: "home" },
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }
}

export default ModifyGarden;
