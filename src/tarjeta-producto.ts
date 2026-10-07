import estilos from './tarjeta-producto.css?inline'
import './boton-app';
import type { DetalleAgregar } from './tipos';

// Da formato de moneda: 1299 -> "$1,299.00"
const pesos = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

export class TarjetaProducto extends HTMLElement {
    // ENTRADAS del contrato: todo llega por atributos
    static observedAttributes = ['producto-id', 'nombre', 'precio', 'imagen', 'existencia'];

    constructor(){
        super();

        this.attachShadow({mode: 'open'});

        // Un solo listener en la sombra: sigue sirviendo aunque se repinte el innerHTML
        this.shadowRoot!.addEventListener('click', (e) => {
            const boton = (e.target as HTMLElement).closest('boton-app');
            if (!boton || this.existencia <= 0) return;

            // SALIDA del contrato: un evento propio con los datos del producto
            this.dispatchEvent(new CustomEvent<DetalleAgregar>('agregar', {
                detail: {
                    id: this.getAttribute('producto-id') ?? '',
                    nombre: this.getAttribute('nombre') ?? '',
                    precio: this.precio,
                },
                bubbles: true,   // sube por el DOM hasta la rejilla
                composed: true,  // cruza el límite del árbol de sombra
            }));
        });
    }

    connectedCallback(){
        this.pintar();
    }

    attributeChangedCallback(){
        // Si todavía no está en la página, connectedCallback se encargará
        if (this.isConnected) this.pintar();
    }

    // Los atributos siempre llegan como texto: hay que convertirlos a número
    private get precio(): number {
        return Number(this.getAttribute('precio') ?? 0);
    }

    private get existencia(): number {
        return Number(this.getAttribute('existencia') ?? 0);
    }

    private pintar(){
        const nombre = this.getAttribute('nombre') ?? '';
        const imagen = this.getAttribute('imagen') ?? '';
        const precio = this.precio;
        const existencia = this.existencia;
        const agotado = existencia <= 0;

        this.shadowRoot!.innerHTML = `
            <style>${estilos}</style>
            <article class="tarjeta">
                <img src="${imagen}" alt="${nombre}">
                <div class="cuerpo">
                    <h3>${nombre}</h3>
                    <p class="precio">${pesos.format(precio)}</p>
                    <p class="existencia ${agotado ? 'agotado' : ''}">${agotado ? 'Agotado' : `${existencia} disponibles`}</p>
                    <boton-app ${agotado ? 'deshabilitado' : ''}>Agregar al carrito</boton-app>
                </div>
            </article>
        `;
    }
}

customElements.define('tarjeta-producto', TarjetaProducto);
