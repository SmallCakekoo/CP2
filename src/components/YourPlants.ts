class YourPlants extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
     <div class="yourplants">
      <img src="" alt="" />
      <h4>a</h4>
    </div>
        `;
  }
}

export default YourPlants;
// aca van a estar en tu jardin virtual las que se añaden
