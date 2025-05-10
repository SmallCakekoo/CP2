import { Plants } from "../types/ApiTypes";
import { AddActions } from "../flux/Actions";
import { store } from "../flux/Store";

class CardPlants extends HTMLElement {
  private plants: Plants[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      this.render();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  private handleAddClick = () => {
    const uuid = this.getAttribute("uuid");
    if (uuid) {
      AddActions.toggleLike(uuid);
    }
  };

  render() {
    const image =
      this.getAttribute("image") || "https://placehold.co/100x100.png";
    const name = this.getAttribute("name") || "Coso desconocido";
    const uuid = this.getAttribute("uuid");
    const state = store.getState();
    const isAdded = uuid ? state.addedPlants.includes(Number(uuid)) : false;

    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
         <style>
           .container {
             display: flex;
             flex-direction: column;
             align-items: center;
             padding: 1rem;
             border: 1px solid #ddd;
             border-radius: 8px;
             margin: 0.5rem;
           }
           img {
             width: 200px;
             height: 200px;
             object-fit: cover;
             border-radius: 4px;
           }
           p {
             margin-top: 0.5rem;
             font-size: 1.1rem;
           }
           button {
             margin-top: 0.5rem;
             padding: 0.5rem 1rem;
             background-color: ${isAdded ? "#ff4444" : "#4CAF50"};
             color: white;
             border: none;
             border-radius: 4px;
             cursor: pointer;
             transition: background-color 0.3s;
           }
           button:hover {
             background-color: ${isAdded ? "#cc0000" : "#45a049"};
           }
         </style>
         <div class="container">
           <img src="${image}" alt="${name}">
           <p>${name}</p>
           <button id="addbtn">${
             isAdded ? "Quitar del jardín" : "Añadir a mi jardín"
           }</button>
         </div>
        `;

    const addButton = this.shadowRoot.querySelector("#addbtn");
    if (addButton) {
      addButton.addEventListener("click", this.handleAddClick);
    }
  }
}

export default CardPlants;
