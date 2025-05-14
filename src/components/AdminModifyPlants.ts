import { Plants } from "../types/ApiTypes";
import getPlants, { updatePlant } from "../services/Plants";

class AdminModifyPlants extends HTMLElement {
  private plants: Plants[] = [];
  private selectedPlant: Plants | null = null;
  private selectedIndex: number = -1;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
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

  private handlePlantSelect(plant: Plants, index: number) {
    this.selectedPlant = plant;
    this.selectedIndex = index;
    this.render();
  }

  private async handleFormSubmit(event: Event) {
    event.preventDefault();
    if (!this.shadowRoot || !this.selectedPlant) return;

    const form = this.shadowRoot.querySelector("form") as HTMLFormElement;
    const formData = new FormData(form);

    // Crear el objeto actualizado de la planta
    const updatedPlant: Plants = {
      ...this.selectedPlant,
      common_name: formData.get("common_name") as string,
      scientific_name: formData.get("scientific_name") as string,
      img: formData.get("img") as string,
      type: formData.get("type") as string,
      origin: formData.get("origin") as string,
      flowering_season: formData.get("flowering_season") as string,
      sun_exposure: formData.get("sun_exposure") as string,
      watering: formData.get("watering") as string,
    };

    try {
      // si tan solo tuviera una API para actualizar la planta
      await updatePlant(updatedPlant);

      // local
      if (this.selectedIndex >= 0) {
        this.plants[this.selectedIndex] = updatedPlant;
      }

      this.selectedPlant = null;
      this.selectedIndex = -1;
      alert("¡Planta actualizada correctamente!");
      this.render();
    } catch (error) {
      console.error("Error updating plant:", error);
      alert("Error al actualizar la planta");
    }
  }

  private handleCancel() {
    this.selectedPlant = null;
    this.selectedIndex = -1;
    this.render();
  }

  async render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        .admin-container {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .admin-title {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
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
        .plants-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .plant-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          cursor: pointer;
          transition: transform 0.2s;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .plant-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .plant-card img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 4px;
        }
        .plant-card h3 {
          margin: 0.5rem 0;
          color: #333;
        }
        .plant-form {
          background-color: #f9f9f9;
          padding: 2rem;
          border-radius: 8px;
          margin-top: 2rem;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        input, select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        .form-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .save-btn {
          padding: 0.5rem 1.5rem;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .cancel-btn {
          padding: 0.5rem 1.5rem;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      
      <div class="admin-container">
        <button class="back-button" id="backBtn">Volver al inicio</button>
        <h2 class="admin-title">Modo Administrador - Modificar Plantas</h2>
        
        ${
          this.selectedPlant
            ? `
          <div class="plant-form">
            <h3>Editar: ${this.selectedPlant.common_name}</h3>
            <form id="editForm">
              <div class="form-group">
                <label for="common_name">Nombre común:</label>
                <input type="text" id="common_name" name="common_name" value="${this.selectedPlant.common_name}" required>
              </div>
              <div class="form-group">
                <label for="scientific_name">Nombre científico:</label>
                <input type="text" id="scientific_name" name="scientific_name" value="${this.selectedPlant.scientific_name}" required>
              </div>
              <div class="form-group">
                <label for="img">URL de imagen:</label>
                <input type="url" id="img" name="img" value="${this.selectedPlant.img}" required>
              </div>
              <div class="form-group">
                <label for="type">Tipo:</label>
                <input type="text" id="type" name="type" value="${this.selectedPlant.type}" required>
              </div>
              <div class="form-group">
                <label for="origin">Origen:</label>
                <input type="text" id="origin" name="origin" value="${this.selectedPlant.origin}" required>
              </div>
              <div class="form-group">
                <label for="flowering_season">Temporada de floración:</label>
                <input type="text" id="flowering_season" name="flowering_season" value="${this.selectedPlant.flowering_season}" required>
              </div>
              <div class="form-group">
                <label for="sun_exposure">Exposición al sol:</label>
                <input type="text" id="sun_exposure" name="sun_exposure" value="${this.selectedPlant.sun_exposure}" required>
              </div>
              <div class="form-group">
                <label for="watering">Riego:</label>
                <input type="text" id="watering" name="watering" value="${this.selectedPlant.watering}" required>
              </div>
              <div class="form-buttons">
                <button type="submit" class="save-btn">Guardar cambios</button>
                <button type="button" class="cancel-btn" id="cancelBtn">Cancelar</button>
              </div>
            </form>
          </div>
        `
            : `
          <div class="plants-list">
            ${this.plants
              .map(
                (plant, index) => `
              <div class="plant-card" data-id="${index}">
                <img src="${plant.img}" alt="${plant.common_name}">
                <h3>${plant.common_name}</h3>
                <p>${plant.scientific_name}</p>
                <small>Haz clic para editar</small>
              </div>
            `
              )
              .join("")}
          </div>
        `
        }
      </div>
    `;

    if (this.selectedPlant) {
      const form = this.shadowRoot.querySelector("#editForm");
      if (form) {
        form.addEventListener("submit", this.handleFormSubmit.bind(this));
      }

      const cancelBtn = this.shadowRoot.querySelector("#cancelBtn");
      if (cancelBtn) {
        cancelBtn.addEventListener("click", this.handleCancel.bind(this));
      }
    } else {
      const plantCards = this.shadowRoot.querySelectorAll(".plant-card");
      plantCards.forEach((card) => {
        card.addEventListener("click", () => {
          const plantIndex = Number(card.getAttribute("data-id"));
          const plant = this.plants[plantIndex];
          if (plant) {
            this.handlePlantSelect(plant, plantIndex);
          }
        });
      });
    }

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

export default AdminModifyPlants;
