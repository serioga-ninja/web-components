// See https://html.spec.whatwg.org/multipage/indices.html#element-interfaces
// for the list of other DOM interfaces.
class FancyButton extends HTMLButtonElement {
    constructor() {
        super(); // always call super() first in the constructor.

        this.addEventListener('click', e => this.onClick());
    }

    // Material design ripple animation.
    onClick() {
        alert('Clicked!');
    }
}

customElements.define('fancy-button', FancyButton, { extends: 'button' });
