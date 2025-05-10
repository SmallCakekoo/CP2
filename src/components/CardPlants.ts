import { Plants } from "../types/ApiTypes";

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

  render() {
    const image =
      this.getAttribute("image") || "https://placehold.co/100x100.png";
    const name = this.getAttribute("name") || "Coso desconocido";

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
         </style>
         <div class="container">
           <img src="${image}" alt="${name}">
           <p>${name}</p>
           <button id="addbtn" onclick=""></button>
         </div>
        `;
  }
}

export default CardPlants;
