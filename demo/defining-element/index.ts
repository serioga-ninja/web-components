class AppDrawer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = '<p>This is the custom element</p>';
    }

}

window.customElements.define('app-drawer', AppDrawer);

// Or use an anonymous class if you don't want a named constructor in current scope.
// window.customElements.define('app-drawer', class extends HTMLElement {
// });

const appDrawer = new AppDrawer();
document.body.appendChild(appDrawer);
