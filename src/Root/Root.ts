import { store } from "../flux/Store";

class Root extends HTMLElement {
  private currentPage: string = "home";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    store.load();
    this.addEventListener(
      "navigate",
      this.handleNavigation.bind(this) as EventListener
    );
    this.render();
  }

  private handleNavigation(event: CustomEvent) {
    if (event.detail && event.detail.page) {
      this.currentPage = event.detail.page;
      this.render();
    }
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
        }
        header {
          background-color: #4CAF50;
          color: white;
          padding: 1rem;
          text-align: center;
        }
        h1 {
          margin: 0;
        }
        nav {
          background-color: #f1f1f1;
          padding: 0.5rem;
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        nav button {
          padding: 0.5rem 1rem;
          background-color: #2196F3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        main {
          padding: 1rem;
        }
      </style>
      
      <header>
        <h1>Mi Jardín Virtual</h1>
      </header>
      
      <nav>
        <button id="homeBtn">Inicio</button>
        <button id="modifyGardenBtn">Modificar Jardín</button>
        <button id="adminBtn">Modo Admin</button>
      </nav>
      
      <main>
        ${this.renderPage()}
      </main>
    `;

    // Agregar event listeners a los botones de navegación
    const homeBtn = this.shadowRoot.querySelector("#homeBtn");
    const modifyGardenBtn = this.shadowRoot.querySelector("#modifyGardenBtn");
    const adminBtn = this.shadowRoot.querySelector("#adminBtn");

    if (homeBtn) {
      homeBtn.addEventListener("click", () => {
        this.currentPage = "home";
        this.render();
      });
    }

    if (modifyGardenBtn) {
      modifyGardenBtn.addEventListener("click", () => {
        this.currentPage = "modifyGarden";
        this.render();
      });
    }

    if (adminBtn) {
      adminBtn.addEventListener("click", () => {
        this.currentPage = "admin";
        this.render();
      });
    }
  }

  private renderPage() {
    switch (this.currentPage) {
      case "home":
        return `
          <card-container></card-container>
          <your-plants></your-plants>
        `;
      case "modifyGarden":
        return `<modify-garden></modify-garden>`;
      case "admin":
        return `<admin-modify-plants></admin-modify-plants>`;
      default:
        return `<p>Página no encontrada</p>`;
    }
  }
}

export default Root;
