# Encargos · ALCOSTO NEVADA

App de gestión de encargos entre tiendas para ALCOSTO NEVADA.

## Stack

- **React 18** + **Vite 5**
- **Firebase** (Firestore + Authentication)
- **GitHub Pages** para el despliegue

## Estructura

```
src/
├── lib/
│   ├── firebase.js       # Configuración Firebase
│   └── constants.js      # Tiendas, estados, utilidades
├── context/
│   └── AuthContext.jsx   # Contexto de autenticación
├── hooks/
│   └── useEncargos.js    # Hook tiempo real Firestore
├── components/
│   ├── LoginScreen.jsx
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── DetalleEncargo.jsx
│   ├── ModalNuevoEncargo.jsx
│   └── ModalEstadisticas.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## Instalación

```bash
npm install
npm run dev
```

## Despliegue en GitHub Pages

1. Instalar gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Añadir al `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Desplegar:
```bash
npm run deploy
```
