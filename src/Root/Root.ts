import { store } from "../flux/Store";

class Root extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    store.load();
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
    <h1>Mi Jardincito</h1>
        <card-container></card-container>
        <your-plants></your-plants>
        `;
  }
}

export default Root;
