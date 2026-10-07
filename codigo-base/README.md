# Código base · Práctica 11 — Componentes con TypeScript puro

Las piezas que **no** vale la pena teclear en clase. Cópialas cuando el maestro lo indique, en
este orden. El TypeScript de los componentes y de `main.ts` lo escribimos juntos.

La carpeta `img/` va completa a `public/img/` de tu proyecto.

---

## 1 · Página · `index.html`

Reemplaza el `index.html` que trae Vite.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <title>Deportiva ITSON · Componentes</title>
  <link rel="stylesheet" href="/src/estilos.css">
</head>
<body>

  <header class="encabezado">
    <div class="encabezado__marca">
      <img src="/img/logo.svg" alt="" height="34">
      <span>ITSON</span>
    </div>

    <div class="encabezado__carrito">
      <span>Carrito: <strong id="cuenta">0</strong></span>
      <!-- Paso 1: aquí va el <boton-app> -->
    </div>
  </header>

  <main class="contenido">
    <section class="portada">
      <h1>Catálogo de temporada</h1>
      <p>Doce productos. Una sola tarjeta escrita una vez.</p>
    </section>

    <!-- Paso 2: aquí va la rejilla de tarjetas -->

    <!-- Tarea: aquí pueden montar sus dos componentes nuevos. -->
    <section class="tarea" id="tarea"></section>
  </main>

  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

## 2 · Estilos de la página · `src/estilos.css`

Los componentes no leen este archivo: traen su CSS en su Shadow DOM. Solo les llegan las
variables de `:root`.

```css
/* ==========================================================================
   estilos.css — el acomodo de la página. No se toca en la práctica.
   Los componentes NO leen este archivo: traen su propio CSS dentro de su
   Shadow DOM. Lo único que sí les llega son las variables de :root.
   ========================================================================== */

:root {
  --color-cian:   #00aeef;
  --color-azul:   #0066cc;
  --color-morado: #8c52ff;
  --color-rojo:   #ff4757;
  --color-verde:  #2e9e5b;
  --color-tinta:  #111827;
  --color-texto:  #374151;
  --color-tenue:  #6b7280;
  --color-linea:  #e5e7eb;
  --color-fondo:  #f7f8fc;
  --radio:        12px;
}

*, *::before, *::after { box-sizing: border-box; }

body {
  margin: 0;
  font-family: "Barlow", "Segoe UI", system-ui, sans-serif;
  color: var(--color-texto);
  background: var(--color-fondo);
}

h1 { margin: 0; color: var(--color-tinta); font-size: 32px; }
p  { margin: 0; }

.encabezado {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 32px;
  background: #fff;
  border-bottom: 1px solid var(--color-linea);
}

.encabezado__marca {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 20px;
  color: var(--color-tinta);
}

.encabezado__carrito {
  display: flex;
  align-items: center;
  gap: 14px;
}

.contenido {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px;
}

.portada { margin-bottom: 24px; }
.portada p { margin-top: 6px; color: var(--color-tenue); }

.rejilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 22px;
}

.tarea {
  display: grid;
  gap: 22px;
  margin-top: 40px;
}

@media (max-width: 640px) {
  .encabezado { padding: 12px 16px; }
  .contenido  { padding: 20px 16px; }
}
```

---

## 3 · Botón · `src/boton-app.css`

```css
/* ==========================================================================
   boton-app.css — los estilos del componente <boton-app>.
   Viven DENTRO de su Shadow DOM: no salen a la página y la página no entra.
   ========================================================================== */

/* :host es la etiqueta <boton-app> misma, vista desde adentro. */
:host {
  display: inline-block;
}

button {
  font: inherit;
  font-weight: 600;
  font-size: 15px;
  padding: 9px 18px;
  border-radius: 999px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: filter .15s ease, transform .15s ease;
}

button:hover:not(:disabled) { filter: brightness(1.08); transform: translateY(-1px); }
button:focus-visible { outline: 3px solid var(--color-cian, #00aeef); outline-offset: 2px; }

/* Las variantes: el componente cambia de aspecto según un atributo. */
.primario {
  background: var(--color-azul, #0066cc);
  color: #fff;
}

.secundario {
  background: #fff;
  color: var(--color-azul, #0066cc);
  border-color: var(--color-azul, #0066cc);
}

.peligro {
  background: var(--color-rojo, #ff4757);
  color: #fff;
}

button:disabled {
  background: var(--color-linea, #e5e7eb);
  color: var(--color-tenue, #6b7280);
  border-color: transparent;
  cursor: not-allowed;
}
```

## 4 · Botón · HTML de adentro

Va dentro de `sombra.innerHTML` en `src/boton-app.ts`, después del `<style>`. Aquí no hay
variables: el `<slot>` recibe el texto escrito entre las etiquetas.

```html
<button class="secundario"><slot>Vaciar</slot></button>
  
```

---

## 5 · Tipos · `src/tipos.ts`

```ts
// NUEVO (Paso 2): la forma de los datos, declarada una sola vez.

// Un producto, tal como aparece en la lista de main.ts.
export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  categoria: string;
  imagen: string;
  existencia: number;
}

// Lo que viaja dentro del evento 'agregar' (la SALIDA de la tarjeta).
export interface DetalleAgregar {
  id: string;
  nombre: string;
  precio: number;
}

// Le avisamos a TypeScript que el evento 'agregar' existe y qué trae.
// Sin esto, e.detail sería de tipo "any" en el addEventListener.
declare global {
  interface HTMLElementEventMap {
    agregar: CustomEvent<DetalleAgregar>;
  }
}
```

## 6 · Tarjeta · `src/tarjeta-producto.css`

```css
/* ==========================================================================
   tarjeta-producto.css — los estilos del componente <tarjeta-producto>.
   ========================================================================== */

:host {
  display: block;
}

.tarjeta {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border: 1px solid var(--color-linea, #e5e7eb);
  border-radius: var(--radio, 12px);
  overflow: hidden;
  transition: transform .18s ease, box-shadow .18s ease;
}

.tarjeta:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(17, 24, 39, .08);
}

img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background: var(--color-fondo, #f7f8fc);
}

.cuerpo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  padding: 16px;
}

h3 {
  margin: 0;
  font-size: 17px;
  color: var(--color-tinta, #111827);
}

.precio {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--color-azul, #0066cc);
}

.existencia {
  margin: 0;
  font-size: 14px;
  color: var(--color-verde, #2e9e5b);
}

/* Cuando no hay piezas, el texto se pinta en rojo. */
.existencia.agotado {
  color: var(--color-rojo, #ff4757);
  font-weight: 600;
}

/* Empuja el botón al fondo de la tarjeta, aunque el nombre sea largo. */
boton-app {
  margin-top: auto;
}
```

## 7 · Tarjeta · HTML de adentro

Va dentro de `this.shadowRoot!.innerHTML` en `src/tarjeta-producto.ts`, después del `<style>`.
Los textos son de ejemplo; cámbialos por las variables:

| Texto de ejemplo | Variable |
|---|---|
| `/img/producto-01.jpg` | `${imagen}` |
| `Tenis para correr Vento` (en el `alt` y el `<h3>`) | `${nombre}` |
| `$1,299.00` | `${pesos.format(precio)}` |
| `8 disponibles` | `${existencia} disponibles` |

```html
<article class="tarjeta">
  <img src="/img/producto-01.jpg" alt="Tenis para correr Vento">
  <div class="cuerpo">
    <h3>Tenis para correr Vento</h3>
    <p class="precio">$1,299.00</p>
    <p class="existencia">8 disponibles</p>
    <boton-app>Agregar al carrito</boton-app>
  </div>
</article>
  
```

Así queda cuando está **agotada** (existencia 0): cambia la clase y el texto de la existencia, y
el botón lleva `deshabilitado`.

```html
<article class="tarjeta">
  <img src="/img/producto-09.jpg" alt="Licra de compresión">
  <div class="cuerpo">
    <h3>Licra de compresión</h3>
    <p class="precio">$529.00</p>
    <p class="existencia agotado">Agotado</p>
    <boton-app deshabilitado>Agregar al carrito</boton-app>
  </div>
</article>
  
```

---

## 8 · Lista de productos · va en `src/main.ts`

Necesita `import type { Producto } from './tipos';` arriba del archivo.

```ts
const productos: Producto[] = [
  { id: 'P-001', nombre: 'Tenis para correr Vento', precio: 1299, categoria: 'calzado', imagen: '/img/producto-01.jpg', existencia: 8 },
  { id: 'P-002', nombre: 'Tenis de entrenamiento Cross', precio: 1549, categoria: 'calzado', imagen: '/img/producto-02.jpg', existencia: 25 },
  { id: 'P-003', nombre: 'Tenis casuales Urbano', precio: 989, categoria: 'calzado', imagen: '/img/producto-03.jpg', existencia: 8 },
  { id: 'P-004', nombre: 'Sandalias de recuperación', precio: 449, categoria: 'calzado', imagen: '/img/producto-04.jpg', existencia: 25 },
  { id: 'P-005', nombre: 'Playera deportiva seca', precio: 399, categoria: 'ropa', imagen: '/img/producto-05.jpg', existencia: 3 },
  { id: 'P-006', nombre: 'Playera de algodón clásica', precio: 289, categoria: 'ropa', imagen: '/img/producto-06.jpg', existencia: 25 },
  { id: 'P-007', nombre: 'Sudadera con capucha', precio: 749, categoria: 'ropa', imagen: '/img/producto-07.jpg', existencia: 8 },
  { id: 'P-008', nombre: 'Short de entrenamiento', precio: 359, categoria: 'ropa', imagen: '/img/producto-08.jpg', existencia: 12 },
  { id: 'P-009', nombre: 'Licra de compresión', precio: 529, categoria: 'ropa', imagen: '/img/producto-09.jpg', existencia: 0 },
  { id: 'P-010', nombre: 'Pantalón deportivo', precio: 649, categoria: 'ropa', imagen: '/img/producto-10.jpg', existencia: 5 },
  { id: 'P-011', nombre: 'Chamarra rompeviento', precio: 899, categoria: 'ropa', imagen: '/img/producto-11.jpg', existencia: 0 },
  { id: 'P-012', nombre: 'Calcetas deportivas (3 pares)', precio: 179, categoria: 'ropa', imagen: '/img/producto-12.jpg', existencia: 25 },
];
```
