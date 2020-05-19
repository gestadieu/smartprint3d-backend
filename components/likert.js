import {
  PolymerElement,
  html
} from '@polymer/polymer/polymer-element.js';

// Define the element's API using an ES2015 class
class Likert extends PolymerElement {

  // Define optional shadow DOM template
  static get template() {
    return html `
      <style>
        /* CSS rules for your element */
      </style>

        <!-- shadow DOM for your element -->

      <div>[[greeting]]</div> <!-- data bindings in shadow DOM -->
    `;
  }

  // Declare properties for the element's public API
  static get properties() {
    return {
      greeting: {
        type: String
      }
    }
  }

  constructor() {
    super();
    this.greeting = 'Hello!';
  }

  // Add methods to the element's public API
  greetMe() {
    console.log(this.greeting);
  }

}

// Register the x-custom element with the browser
customElements.define('likert', Likert);