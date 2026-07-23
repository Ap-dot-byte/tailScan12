<template>
  <div id="app">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <img src="../assets/img/mascota.png" alt="Mascota" class="logo-img" />
        <span class="tail">Tail</span><span class="scan">Scan</span>
      </div>
      <nav>
        <a href="#" @click.prevent="irAInicio">Inicio</a>
        <a href="#" @click.prevent="irAGenerarQR">Registrar Mascota</a>
        <a href="#" class="active">Reporte en Mapa</a>
        <a href="#">Adopción y Perdidos</a>
        <a href="#">Cuidados</a>
        <a href="#">Servicios</a>
      </nav>
    </header>

    <!-- Controles -->
    <div class="controls">
      <button id="btnReport" class="btn btn-primary">➕ Reportar mascota</button>
      <button id="btnZoomAll" class="btn btn-success">📍 Ver todas</button>
      <button id="btnMyLocation" class="btn btn-info">🎯 Mi ubicación</button>
      <button id="btnClear" class="btn btn-danger">🗑️ Limpiar</button>
      <button id="btnExamples" class="btn btn-warning">📋 Ejemplos</button>
    </div>

    <!-- Mapa -->
    <div id="map"></div>

    <!-- Formulario -->
    <div id="formPanel" class="form-panel hidden">
      <div class="form-header">
        <h3>📝 Reportar mascota</h3>
        <button id="btnCloseForm" class="btn-close">✕</button>
      </div>
      
      <form id="petForm">
        <div class="form-grid">
          <div class="form-group">
            <label for="reportType">Tipo de reporte *</label>
            <select id="reportType" required>
              <option value="visto">👀 Visto</option>
              <option value="perdido">😢 Perdido</option>
              <option value="encontrado">🎉 Encontrado</option>
            </select>
          </div>

          <div class="form-group">
            <label for="animalType">Tipo de animal *</label>
            <select id="animalType" required>
              <option value="perro">🐕 Perro</option>
              <option value="gato">🐈 Gato</option>
              <option value="cabra">🐐 Cabra</option>
              <option value="otro">🐾 Otro</option>
            </select>
          </div>

          <div class="form-group">
            <label for="petName">Nombre de la mascota</label>
            <input type="text" id="petName" placeholder="Ej: Firulais">
          </div>

          <div class="form-group">
            <label for="petColor">Color / Señas</label>
            <input type="text" id="petColor" placeholder="Ej: Marrón con blanco">
          </div>

          <div class="form-group full-width">
            <label for="petDesc">Descripción detallada *</label>
            <textarea id="petDesc" rows="3" required 
              placeholder="Describe: tamaño, color, señas particulares..."></textarea>
          </div>

          <div class="form-group full-width">
            <label>📍 Ubicación exacta *</label>
            <div class="location-selector">
              <span id="coordsDisplay" class="coords-display">❌ No seleccionada</span>
              <button type="button" id="btnSelectLocation" class="btn btn-sm btn-info">
                📍 Seleccionar en mapa
              </button>
              <button type="button" id="btnUseMyLocation" class="btn btn-sm btn-success">
                🎯 Mi ubicación
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-success">✅ Guardar reporte</button>
            <button type="button" id="btnCancelForm" class="btn btn-secondary">Cancelar</button>
          </div>
        </div>
      </form>
    </div>

    <!-- Lista de reportes -->
    <div class="list-section">
      <div class="list-header">
        <h3>📋 Reportes activos</h3>
        <span id="petCounter" class="badge">0</span>
      </div>
      <div id="petsList" class="pets-list">
        <div class="empty-state">
          <span class="empty-icon">🐾</span>
          <p>No hay reportes activos</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import 'leaflet/dist/leaflet.css';

const router = useRouter();

const irAInicio = () => router.push('/home');
const irAGenerarQR = () => router.push('/generador-qr');

onMounted(() => {
  import('leaflet').then(L => {
    // Configuración
    const CONFIG = {
      map: {
        center: [13.9943, -89.5533],
        zoom: 15,
        tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        tileAttribution: '© OpenStreetMap'
      },
      status: {
        visto: { label: '👀 Visto', color: '#4299e1', bg: '#fefcbf' },
        perdido: { label: '😢 Perdido', color: '#fc8181', bg: '#fed7d7' },
        encontrado: { label: '🎉 Encontrado', color: '#48bb78', bg: '#c6f6d5' }
      },
      emojis: {
        perro: '🐕',
        gato: '🐈',
        otro: '🐾'
      }
    };

    // Estado
    const state = {
      pets: [],
      selectedLocation: null,
      isSelectingLocation: false,
      userLocation: null,
      map: null,
      markers: [],
      locationMarker: null
    };

    // DOM References
    const DOM = {
      map: document.getElementById('map'),
      formPanel: document.getElementById('formPanel'),
      petForm: document.getElementById('petForm'),
      petsList: document.getElementById('petsList'),
      petCounter: document.getElementById('petCounter'),
      coordsDisplay: document.getElementById('coordsDisplay'),
      reportType: document.getElementById('reportType'),
      animalType: document.getElementById('animalType'),
      petName: document.getElementById('petName'),
      petColor: document.getElementById('petColor'),
      petDesc: document.getElementById('petDesc'),
      btnReport: document.getElementById('btnReport'),
      btnZoomAll: document.getElementById('btnZoomAll'),
      btnMyLocation: document.getElementById('btnMyLocation'),
      btnClear: document.getElementById('btnClear'),
      btnExamples: document.getElementById('btnExamples'),
      btnCloseForm: document.getElementById('btnCloseForm'),
      btnCancelForm: document.getElementById('btnCancelForm'),
      btnSelectLocation: document.getElementById('btnSelectLocation'),
      btnUseMyLocation: document.getElementById('btnUseMyLocation')
    };

    // Inicializar mapa
    function initMap() {
      state.map = L.map('map').setView(CONFIG.map.center, CONFIG.map.zoom);
      L.tileLayer(CONFIG.map.tileUrl, {
        attribution: CONFIG.map.tileAttribution,
        maxZoom: 19
      }).addTo(state.map);

      state.map.on('click', function(e) {
        if (state.isSelectingLocation) {
          state.selectedLocation = e.latlng;
          updateLocationDisplay(e.latlng.lat, e.latlng.lng);
          state.isSelectingLocation = false;
        }
      });

      getUserLocation();
      setTimeout(() => state.map.invalidateSize(), 200);
    }

    function getUserLocation() {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const { latitude, longitude } = position.coords;
          state.userLocation = { lat: latitude, lng: longitude };
          state.map.setView([latitude, longitude], 16);
        },
        function() {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }

    function addMarker(pet) {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<span>🐾</span>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34]
      });
      const marker = L.marker([pet.lat, pet.lng], { icon })
        .addTo(state.map)
        .bindPopup(`<b>${pet.name || 'Sin nombre'}</b><br>${pet.description || ''}`);
      marker.petId = pet.id;
      state.markers.push(marker);
    }

    function removeMarker(id) {
      const idx = state.markers.findIndex(m => m.petId === id);
      if (idx !== -1) {
        state.map.removeLayer(state.markers[idx]);
        state.markers.splice(idx, 1);
      }
    }

    function clearMarkers() {
      state.markers.forEach(m => state.map.removeLayer(m));
      state.markers = [];
    }

    function zoomToAll() {
      if (state.pets.length === 0) {
        if (state.userLocation) {
          state.map.setView([state.userLocation.lat, state.userLocation.lng], 16);
        }
        return;
      }
      const bounds = L.latLngBounds(state.pets.map(p => [p.lat, p.lng]));
      state.map.fitBounds(bounds, { padding: [50, 50] });
    }

    // CRUD
    function addPet(petData) {
      const pet = { id: Date.now(), ...petData, createdAt: new Date().toISOString() };
      state.pets.push(pet);
      if (pet.status !== 'encontrado') addMarker(pet);
      renderPets();
      updateCounter();
      return pet;
    }

    function deletePet(id) {
      if (!confirm('¿Eliminar este reporte?')) return;
      state.pets = state.pets.filter(p => p.id !== id);
      removeMarker(id);
      renderPets();
      updateCounter();
    }

    function clearAllPets() {
      if (state.pets.length === 0) return;
      if (!confirm('¿Eliminar todos los reportes?')) return;
      state.pets = [];
      clearMarkers();
      renderPets();
      updateCounter();
    }

    function loadExamples() {
      if (state.pets.length > 0 && !confirm('¿Cargar ejemplos? Se borrarán los datos actuales')) return;
      clearMarkers();
      state.pets = [];
      const examples = [
        { name: 'Firulais', animalType: 'perro', status: 'perdido', color: 'Marrón', description: 'Se perdió cerca del parque', lat: 13.9950, lng: -89.5540 },
        { name: '', animalType: 'gato', status: 'visto', color: 'Negro', description: 'Visto en el parque', lat: 13.9935, lng: -89.5520 },
        { name: 'Max', animalType: 'perro', status: 'encontrado', color: 'Dorado', description: '¡Ya fue encontrado!', lat: 13.9960, lng: -89.5550 }
      ];
      examples.forEach(data => addPet(data));
      zoomToAll();
    }

    // UI
    function renderPets() {
      const container = DOM.petsList;
      const activePets = state.pets.filter(p => p.status !== 'encontrado');
      if (activePets.length === 0) {
        container.innerHTML = `<div class="empty-state"><span>🐾</span><p>No hay reportes activos</p></div>`;
        return;
      }
      container.innerHTML = activePets.map(pet => `
        <div class="pet-card">
          <button class="btn-delete" data-id="${pet.id}">×</button>
          <div class="pet-name">${pet.name || 'Sin nombre'}</div>
          <div class="pet-detail">${pet.description || ''}</div>
          <span class="pet-status" style="background: ${CONFIG.status[pet.status]?.bg || '#ddd'}">${CONFIG.status[pet.status]?.label || pet.status}</span>
        </div>
      `).join('');
      container.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => deletePet(parseInt(btn.dataset.id)));
      });
    }

    function updateCounter() {
      DOM.petCounter.textContent = state.pets.filter(p => p.status !== 'encontrado').length;
    }

    function updateLocationDisplay(lat, lng) {
      DOM.coordsDisplay.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      DOM.coordsDisplay.classList.add('selected');
    }

    function showForm() {
      DOM.formPanel.classList.remove('hidden');
    }

    function hideForm() {
      DOM.formPanel.classList.add('hidden');
      DOM.petForm.reset();
      state.selectedLocation = null;
      state.isSelectingLocation = false;
      DOM.coordsDisplay.textContent = '❌ No seleccionada';
    }

    function startLocationSelection() {
      state.isSelectingLocation = true;
      DOM.coordsDisplay.textContent = '🔴 Haz clic en el mapa...';
      showForm();
    }

    function useMyLocation() {
      if (state.userLocation) {
        state.selectedLocation = state.userLocation;
        updateLocationDisplay(state.userLocation.lat, state.userLocation.lng);
        state.isSelectingLocation = false;
        showForm();
      }
    }

    function handleFormSubmit(e) {
      e.preventDefault();
      if (!state.selectedLocation) {
        alert('⚠️ Primero selecciona una ubicación');
        return;
      }
      const petData = {
        name: DOM.petName.value.trim() || 'Sin nombre',
        animalType: DOM.animalType.value,
        status: DOM.reportType.value,
        color: DOM.petColor.value.trim() || 'No especificado',
        description: DOM.petDesc.value.trim() || 'Sin descripción',
        lat: state.selectedLocation.lat,
        lng: state.selectedLocation.lng
      };
      addPet(petData);
      hideForm();
      alert('✅ ¡Reporte guardado exitosamente!');
    }

    // Eventos
    function initEvents() {
      DOM.btnReport.addEventListener('click', startLocationSelection);
      DOM.btnSelectLocation.addEventListener('click', startLocationSelection);
      DOM.btnUseMyLocation.addEventListener('click', useMyLocation);
      DOM.btnCloseForm.addEventListener('click', hideForm);
      DOM.btnCancelForm.addEventListener('click', hideForm);
      DOM.petForm.addEventListener('submit', handleFormSubmit);
      DOM.btnZoomAll.addEventListener('click', zoomToAll);
      DOM.btnMyLocation.addEventListener('click', () => {
        if (state.userLocation) state.map.setView([state.userLocation.lat, state.userLocation.lng], 16);
      });
      DOM.btnClear.addEventListener('click', clearAllPets);
      DOM.btnExamples.addEventListener('click', loadExamples);
    }

    // Iniciar
    initMap();
    initEvents();
    renderPets();
    updateCounter();
    setTimeout(() => loadExamples(), 500);
  });
});
</script>

<style scoped>
:root {
  --primary: #4299e1;
  --success: #48bb78;
  --danger: #fc8181;
  --gray-200: #e2e8f0;
  --gray-500: #718096;
  --gray-700: #2d3748;
  --radius: 12px;
  --shadow: 0 10px 40px rgba(0,0,0,0.1);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
#app { max-width: 1200px; margin: 0 auto; background: white; border-radius: var(--radius); box-shadow: var(--shadow); padding: 24px; font-family: 'Segoe UI', sans-serif; color: var(--gray-700); }

.header { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; margin-bottom: 20px; border-bottom: 2px solid var(--gray-200); }
.logo { display: flex; align-items: center; gap: 10px; font-size: 24px; font-weight: 800; }
.logo .tail { color: #1e3a8a; }
.logo .scan { color: #ff8a3d; }
.logo-img { width: 30px; height: 30px; object-fit: contain; }
nav { display: flex; gap: 24px; font-size: 14px; font-weight: 600; }
nav a { text-decoration: none; color: var(--gray-700); opacity: 0.75; cursor: pointer; }
nav a.active { opacity: 1; color: #f2632b; border-bottom: 2px solid #f2632b; padding-bottom: 4px; }

.controls { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 16px; }
.btn { padding: 10px 20px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; gap: 8px; }
.btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.btn-primary { background: var(--primary); color: white; }
.btn-success { background: var(--success); color: white; }
.btn-danger { background: var(--danger); color: white; }
.btn-warning { background: #ed8936; color: white; }
.btn-info { background: #63b3ed; color: white; }
.btn-secondary { background: var(--gray-200); color: var(--gray-700); }
.btn-sm { padding: 6px 14px; font-size: 12px; }
.btn-close { background: none; border: none; font-size: 24px; cursor: pointer; color: var(--gray-500); }

#map { height: 450px; width: 100%; border-radius: var(--radius); border: 2px solid var(--gray-200); margin-bottom: 16px; }

.form-panel { background: #f7fafc; padding: 20px; border-radius: var(--radius); border: 2px solid var(--gray-200); margin-bottom: 16px; }
.form-panel.hidden { display: none; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group.full-width { grid-column: 1 / -1; }
.form-group label { font-weight: 600; font-size: 13px; color: var(--gray-700); }
.form-group input, .form-group textarea, .form-group select { padding: 9px 12px; border: 2px solid var(--gray-200); border-radius: 8px; font-size: 14px; font-family: inherit; }
.form-group input:focus, .form-group textarea:focus, .form-group select:focus { outline: none; border-color: var(--primary); }
.form-actions { grid-column: 1 / -1; display: flex; gap: 10px; margin-top: 8px; }

.location-selector { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.coords-display { padding: 8px 12px; background: white; border: 2px solid var(--gray-200); border-radius: 8px; font-family: monospace; font-size: 13px; color: var(--gray-500); flex: 1; min-width: 150px; }
.coords-display.selected { border-color: var(--success); color: var(--gray-700); background: #f0fff4; }

.list-section { margin-top: 16px; padding-top: 16px; border-top: 2px solid var(--gray-200); }
.list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.badge { background: var(--primary); color: white; padding: 4px 14px; border-radius: 20px; font-size: 14px; font-weight: 600; }
.pets-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }

.pet-card { background: white; border: 2px solid var(--gray-200); border-radius: var(--radius); padding: 14px; position: relative; }
.pet-card .pet-name { font-weight: 700; font-size: 17px; }
.pet-card .pet-detail { color: var(--gray-500); font-size: 13px; margin: 4px 0; }
.pet-card .pet-status { display: inline-block; padding: 2px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; margin-top: 6px; }
.pet-card .btn-delete { position: absolute; top: 6px; right: 6px; background: var(--danger); color: white; border: none; border-radius: 50%; width: 26px; height: 26px; cursor: pointer; font-size: 14px; }

.empty-state { grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--gray-500); }
.empty-state .empty-icon { font-size: 40px; display: block; margin-bottom: 8px; }

.custom-marker { width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; background: var(--primary); font-size: 16px; cursor: pointer; }

@media (max-width: 768px) {
  #app { padding: 16px; }
  .form-grid { grid-template-columns: 1fr; }
  .controls { flex-direction: column; }
  .controls .btn { justify-content: center; }
  #map { height: 300px; }
  .pets-list { grid-template-columns: 1fr; }
  .header { flex-direction: column; gap: 12px; }
  nav { flex-wrap: wrap; justify-content: center; }
}
</style>