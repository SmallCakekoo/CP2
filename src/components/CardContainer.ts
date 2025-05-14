import { Plants } from "../types/ApiTypes";
import getPlants from "../services/Plants";

class CardContainer extends HTMLElement {
  private plants: Plants[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      const data = await getPlants();
      this.plants = Array.isArray(data) ? data : [];
      this.render();
    } catch (error) {
      console.error("Error fetching plants:", error);
      this.plants = [];
    }
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        .container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          padding: 1rem;
        }
      </style>
      <div class="container">
        ${this.plants
          .map((plant, index) => {
            const image = plant.img || "https://placehold.co/100x100.png";
            const name = plant.common_name || "Planta desconocida";
            return `
              <card-plants
                uuid="${index + 1}"
                image="${image}"
                name="${name}">
              </card-plants>
            `;
          })
          .join("")}
      </div>
    `;
  }
}

export default CardContainer;
