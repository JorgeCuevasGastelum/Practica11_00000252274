# Práctica 11 — Componentes con TypeScript puro

Catálogo de productos hecho con **Web Components** (Custom Elements + Shadow DOM) y TypeScript,
sin ningún framework. Proyecto creado con Vite (plantilla `vanilla-ts`).

## Cómo correrlo

```bash
npm install
npm run dev
```

## Estructura

| Archivo | Qué hace |
|---|---|
| `src/boton-app.ts` + `boton-app.css` | Componente `<boton-app>`: variante y deshabilitado por atributos, texto por `<slot>` |
| `src/tarjeta-producto.ts` + `tarjeta-producto.css` | Componente `<tarjeta-producto>`: usa `<boton-app>` por dentro y emite el evento `agregar` |
| `src/tipos.ts` | Interfaces `Producto` y `DetalleAgregar`, y el tipo del evento `agregar` |
| `src/main.ts` | Crea una tarjeta por producto y escucha `agregar` una sola vez en la rejilla |
| `evidencias/` | Capturas de pantalla |

El contrato de cada componente tiene tres partes:

- **Lo que recibe:** atributos (`variante`, `deshabilitado`, `nombre`, `precio`, `imagen`, `existencia`, `producto-id`) y el texto del slot.
- **Lo que avisa hacia afuera:** el evento propio `agregar` con `{ id, nombre, precio }`.
- **Lo que nadie más puede tocar:** el HTML y el CSS dentro del Shadow DOM.

---

## Ejercicio 1 — Botón reutilizable

### Cambiar la variante en el HTML sin tocar el TypeScript

En `index.html` el botón del encabezado es:

```html
<boton-app variante="secundario" id="vaciar">Vaciar</boton-app>
```

- Con `variante="secundario"` el botón se ve blanco con borde y texto azul.
- Con `variante="primario"` el fondo se vuelve azul y el texto blanco.
- Con `variante="peligro"` el fondo se vuelve rojo y el texto blanco.
- Sin el atributo `variante` toma `primario` por defecto.
- Al agregar `deshabilitado`, se pone gris, el cursor cambia a "no permitido" y deja de responder a los clics.

**Qué pasa:** el aspecto cambia sin modificar ni una línea de TypeScript. El componente lee
el atributo en `pintar()` y lo usa como clase del `<button>` interno, y esa clase ya tiene sus
estilos en `boton-app.css`. Como `variante` está en `observedAttributes`, si el atributo cambia
con la página ya abierta (por ejemplo desde DevTools), `attributeChangedCallback` vuelve a pintar
el botón al momento.

### ¿Por qué el nombre de una etiqueta propia debe llevar guion?

Porque así lo exige el estándar de Custom Elements: `customElements.define()` lanza un error si el
nombre no tiene guion. El guion sirve para:

1. **Evitar choques con etiquetas nativas.** Las etiquetas de HTML (`button`, `header`, `dialog`…)
   nunca llevan guion, así que el navegador puede agregar nuevas en el futuro sin romper los
   componentes de nadie. Si alguien hubiera creado `<boton>` y después HTML agregara una etiqueta
   con ese nombre, habría conflicto. Con `<boton-app>` eso no puede pasar.
2. **Que el parser sepa de inmediato que es un elemento personalizado.** Al ver el guion, lo trata
   como un elemento personalizado "por definir" y no como una etiqueta desconocida
   (`HTMLUnknownElement`). Cuando se registra la clase, el elemento se "actualiza" (upgrade).

---

## Ejercicio 2 — Tarjeta de producto

- `<tarjeta-producto>` recibe `producto-id`, `nombre`, `precio`, `imagen` y `existencia` por atributos.
- Por dentro usa `<boton-app>` (el componente del Ejercicio 1).
- Si `existencia` es `0`, muestra **«Agotado»** en rojo y el botón lleva `deshabilitado`
  (en el catálogo pasa con *Licra de compresión* y *Chamarra rompeviento*).
- Al presionar «Agregar al carrito», la tarjeta emite el evento `agregar` con `{ id, nombre, precio }`.
- `main.ts` escucha ese evento **una sola vez**, en la rejilla, y no en cada tarjeta. Ahí sube
  el contador, y «Vaciar» lo regresa a cero.

### Un atributo siempre llega como texto

`getAttribute('precio')` regresa `"1299"` (string), no `1299`. Por eso se convierte con `Number(...)`
antes de usarlo:

- Sin la conversión, `existencia <= 0` compararía texto, y `Intl.NumberFormat` o cualquier suma
  (`"1299" + 1` → `"12991"`) darían resultados incorrectos.
- Por la misma razón, en `main.ts` se hace `String(p.precio)` al ponerlo con `setAttribute`.

### Si el evento no puede salir del árbol de sombra

El evento se crea con:

```ts
new CustomEvent('agregar', { detail, bubbles: true, composed: true })
```

- `bubbles: true` hace que el evento suba por los padres hasta llegar a `#rejilla`.
- `composed: true` le permite cruzar el límite del Shadow DOM.

Si falta alguno de los dos, el evento se dispara pero se queda dentro y no llega a la rejilla, así
que **el contador no se mueve y no aparece ningún error en la consola**. Para el navegador no hay
ningún error: simplemente nadie escuchó el evento. Por eso este fallo es difícil de detectar.

---

## Evidencias

En la carpeta `evidencias/`:

1. `boton-variantes.png` — el botón en sus variantes (primario, secundario, peligro y deshabilitado).
2. `catalogo-agotados.png` — el catálogo con las tarjetas agotadas.
3. `contador.png` — el contador después de agregar productos.
