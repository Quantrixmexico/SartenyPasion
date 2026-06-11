# Sartén &amp; Pasión — Sistema de Gestión

Panel de administración integral para el restaurante **Sartén &amp; Pasión** (cocina mexicana de autor · Tijuana, BC). Prototipo de alta fidelidad, 100 % del lado del cliente: **no requiere build ni backend**.

---

## ▶️ Cómo correrlo

Como los módulos `.jsx` se cargan con `fetch` (vía `<script type="text/babel" src="…">`), **no se puede abrir con doble clic** (`file://` bloquea el fetch). Hay que servirlo con un servidor estático:

```bash
# Opción 1 — Python (incluido en casi todo)
python3 -m http.server 8000

# Opción 2 — Node
npx serve .

# Luego abre:
http://localhost:8000
```

---

## 🚀 Publicar en GitHub Pages

1. Crea un repo y sube **todo** el contenido de esta carpeta (incluido `.nojekyll`).
2. En GitHub: **Settings → Pages → Build and deployment → Source: _Deploy from a branch_**, rama `main`, carpeta `/ (root)`.
3. Espera ~1 min. Tu test queda en `https://<usuario>.github.io/<repo>/`.

> El archivo `.nojekyll` evita que GitHub procese el sitio con Jekyll (necesario para que sirva los archivos tal cual).

---

## 👥 Perfiles y permisos (RBAC)

Usa el selector de perfil en la barra superior. Cada perfil ve y administra solo sus módulos:

| Perfil | Persona | Alcance |
|---|---|---|
| **Dueño** | Rodrigo Cárdenas | Acceso total · admin de permisos · reporte a socios |
| **Gerente general** | Mariana Castro | Operación completa, equipo y capturas |
| **Jefa de cocina** | Luisa Vázquez | Cocina/KDS, recetas, inventario, mermas, recepción |
| **Hostess · caja** | Karla Torres | Mapa de mesas, POS, facturación |
| **Mesero** | Ricardo Gómez | POS y mapa de mesas |
| **Contadora** | Diana Reyes | Conciliación, CFDI, proveedores, nómina, reportes |

La pantalla **Sistema → Perfiles y permisos** tiene una matriz editable: al encender/apagar una celda, cambia en vivo lo que ese perfil ve en la navegación.

---

## 🧩 Estructura

```
index.html          → shell + carga de scripts (orden importa)
styles.css          → tokens de diseño + todos los estilos
app.jsx             → shell de la app, navegación, RBAC, tweaks
data.jsx            → datos de muestra (ventas, inventario, perfiles…)
components.jsx      → componentes e íconos compartidos
tweaks-panel.jsx    → panel de ajustes en vivo
screens/*.jsx       → una pantalla por módulo (dashboard, pos, cocina, …)
logo.png            → logotipo
```

## 🛠️ Stack

- **React 18** + **Babel Standalone** (transpila JSX en el navegador, vía CDN `unpkg`).
- Sin dependencias instalables, sin bundler. La primera carga toma ~1 s mientras Babel transpila.
- Tipografías: Instrument Serif, Geist, JetBrains Mono (Google Fonts).

## ⚠️ Notas

- Los datos son **de muestra (mock)**; no hay persistencia ni API. Los permisos viven en la sesión del navegador.
- Diseñado para escritorio (ancho base 1440 px).
- Para producción real conviene migrar a un build (Vite/Next) y precompilar el JSX en lugar de usar Babel en el navegador.
