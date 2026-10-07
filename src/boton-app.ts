import estilos from './boton-app.css?inline'

export class BotonApp extends HTMLElement {
    // Los atributos que el navegador vigila: al cambiar, llama a attributeChangedCallback
    static observedAttributes = ['variante', 'deshabilitado'];

    private boton: HTMLButtonElement;

    //Se ejecuta cuando se CREA el elemento
    constructor(){
        super();

        const sombra = this.attachShadow({mode: 'open'})

        sombra.innerHTML = `
            <style>${estilos}</style>
            <button><slot></slot></button>
        `;

        this.boton = sombra.querySelector('button')!;
    }

    // connectedCallback
    connectedCallback(){
        this.pintar();
    }

    attributeChangedCallback(){
        this.pintar();
    }

    //disconnectedCallback
    //adoptedCallback

    private pintar(){
        this.boton.className = this.getAttribute('variante') ?? 'primario';
        this.boton.disabled = this.hasAttribute('deshabilitado');
    }
}


//como se va llamar el elemento (debe llevar guion)
customElements.define('boton-app', BotonApp);
