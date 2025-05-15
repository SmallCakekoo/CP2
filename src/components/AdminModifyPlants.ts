import { Plants } from "../types/ApiTypes";
import { updatePlant } from "../services/Plants";
import { store } from "../flux/Store";
import { StoreActions, StoreActionTypes } from "../flux/Actions";
import { AppDispatcher } from "../flux/Dispatcher";

class AdminModifyPlants extends HTMLElement {
  private selectedPlant: Plants | null = null;
  private selectedIndex: number = -1;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    store.subscribe(this.handleStateChange.bind(this));

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
      await updatePlant(updatedPlant);

      const state = store.getState();
      const updatedPlants = [...state.plants];
      if (this.selectedIndex >= 0) {
        updatedPlants[this.selectedIndex] = updatedPlant;
      }

      AppDispatcher.dispatch({
        type: StoreActionTypes.LOAD_PLANTS,
        payload: updatedPlants,
      });

      this.selectedPlant = null;
      this.selectedIndex = -1;

      await StoreActions.loadPlants();
    } catch (error) {
      console.error("Error al actualizar la planta:", error);
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

    const state = store.getState();
    const plants = state.plants || [];

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
        
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
        
        .admin-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background-color: var(--color-green-bg);
          border-radius: 15px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .admin-title {
          text-align: center;
          color: var(--color-green-dark);
          font-size: 2.5rem;
          margin-bottom: 0.8rem;
          font-weight: 700;
        }
        
        .admin-subtitle {
          color: var(--color-text-medium);
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto 1.5rem;
          text-align: center;
          font-weight: 400;
        }
        
        .back-button {
          display: inline-block;
          margin-bottom: 2rem;
          padding: 0.8rem 1.5rem;
          background-color: var(--color-green-medium);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .back-button:hover {
          background-color: var(--color-green-dark);
          transform: translateY(-3px);
        }
        
        .plants-list {
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
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
        }
        
        .plant-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .plant-card img {
          width: 180px;
          height: 180px;
          object-fit: cover;
          border-radius: 8px;
          transition: transform 0.5s ease;
        }
        
        .plant-card:hover img {
          transform: scale(1.05);
        }
        
        .plant-card h3 {
          margin: 1rem 0 0.3rem 0;
          color: var(--color-green-dark);
          font-weight: 600;
          font-size: 1.3rem;
        }
        
        .plant-card p {
          margin: 0.3rem 0 0.8rem 0;
          font-size: 0.9rem;
          color: var(--color-text-medium);
          font-style: italic;
        }
        
        .plant-card small {
          color: var(--color-green-medium);
          margin-top: 0.5rem;
          font-weight: 500;
        }
        
        .plant-form {
          background-color: #fff;
          padding: 2rem;
          border-radius: 12px;
          margin-top: 2rem;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }
        
        .plant-form h3 {
          color: var(--color-green-dark);
          margin-bottom: 1.5rem;
          text-align: center;
          font-size: 1.8rem;
          font-weight: 600;
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--color-text-dark);
          font-size: 1rem;
        }
        
        input, select {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        input:focus, select:focus {
          outline: none;
          border-color: var(--color-green-medium);
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
        }
        
        .form-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          justify-content: center;
        }
        
        .save-btn {
          padding: 0.8rem 2rem;
          background-color: var(--color-green-medium);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .save-btn:hover {
          background-color: var(--color-green-dark);
          transform: translateY(-3px);
        }
        
        .cancel-btn {
          padding: 0.8rem 2rem;
          background-color: #e57373;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        
        .cancel-btn:hover {
          background-color: #c62828;
          transform: translateY(-3px);
        }
        
        @media (max-width: 768px) {
          .plants-list {
            grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
            gap: 1.5rem;
          }
          .admin-container {
            padding: 1.5rem;
          }
          .plant-form {
            padding: 1.5rem;
          }
        }
      </style>
      
      <div class="admin-container">
        <button class="back-button" id="backBtn">← Volver</button>
        <h2 class="admin-title">Modo Administrador - Modificar Plantas</h2>
        <p class="admin-subtitle">Aquí puedes gestionar y actualizar la información de las plantas disponibles en el catálogo</p>
        
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
            ${plants
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
          const plant = plants[plantIndex];
          if (plant) {
            this.handlePlantSelect(plant, plantIndex);
          }
        });
      });
    }

    const backBtn = this.shadowRoot.querySelector("#backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        StoreActions.navigate("home");
      });
    }
  }
}

export default AdminModifyPlants;
