<template>
  <div class="consejos-container">
    <!-- HEADER -->
    <header>
      <div class="logo">
        <svg viewBox="0 0 100 100" fill="none" stroke="#1e40c9" stroke-width="4">
          <circle cx="50" cy="55" r="22"/>
          <circle cx="30" cy="30" r="8"/>
          <circle cx="70" cy="30" r="8"/>
          <circle cx="18" cy="50" r="7"/>
          <circle cx="82" cy="50" r="7"/>
        </svg>
        <span><span class="tail">Tail</span><span class="scan">Scan</span></span>
      </div>
      <nav>
        <a href="#" @click.prevent="irAInicio">Inicio</a>
        <a href="#" class="active">Consejos</a>
        <a href="#" @click.prevent="irAGenerarQR">Registrar Mascota</a>
        <a href="#" @click.prevent="irAlMapa">Reporte en Mapa</a>
        <a href="#">Servicios</a>
      </nav>
      <div class="header-right">
        <div class="bell">
          🔔
          <span class="dot"></span>
        </div>
        <button class="login-btn">👤 Iniciar sesión</button>
      </div>
    </header>

    <!-- HERO / FORM -->
    <section class="hero-wrap">
      <div class="blob-left"></div>
      <div class="blob-right"></div>
      <div class="dots blue top-left">
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="dots orange mid-right">
        <span></span><span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="hero-content">
        <h1>Consejos de la Comunidad</h1>
        <div class="divider">
          <span class="line"></span>
          <span class="paw-icon">🐾</span>
          <span class="line"></span>
        </div>
        <p>Comparte tu experiencia y ayuda a otras personas a cuidar mejor de sus mascotas (perros y gatos)</p>
      </div>
      <div class="form-card">
        <div class="form-title">💬 Comparte tu consejo</div>
        <div class="form-row">
          <div class="input-field">
            <span class="icon">🐾</span>
            <select>
              <option>Selecciona una categoría</option>
              <option>Perro</option>
              <option>Gato</option>
            </select>
          </div>
          <div class="input-field">
            <span class="icon">✏️</span>
            <input type="text" placeholder="Título de tu consejo">
          </div>
        </div>
        <div class="textarea-field">
          <span class="icon">📝</span>
          <textarea placeholder="Escribe tu consejo aquí..."></textarea>
        </div>
        <button class="submit-btn" @click="enviarConsejo">📩 Enviar Consejo</button>
      </div>
    </section>

    <!-- CONSEJOS COMPARTIDOS -->
    <h2 class="shared-title">
      Consejos Compartidos por la Comunidad
      <div class="divider" style="margin-top:14px;">
        <span class="line"></span>
        <span class="paw-icon">🐾</span>
        <span class="line"></span>
      </div>
    </h2>
    <div class="cards-wrap">
      <div class="tip-card" v-for="consejo in consejos" :key="consejo.id">
        <span class="bookmark">🔖</span>
        <div class="tip-left">
          <span class="badge" :class="consejo.tipo === 'perro' ? 'dog' : 'cat'">
            🐾 {{ consejo.tipo === 'perro' ? 'Perro' : 'Gato' }}
          </span>
          <h3>{{ consejo.titulo }}</h3>
          <p>{{ consejo.descripcion }}</p>
          <div class="author">
            <img :src="consejo.avatar" :alt="consejo.autor">
            <div>
              <div class="name">Por {{ consejo.autor }}</div>
              <div class="time">{{ consejo.fecha }}</div>
            </div>
          </div>
        </div>
        <div class="tip-illustration">{{ consejo.emoji }}</div>
      </div>
    </div>

    <!-- FOOTER -->
    <footer>
      <div class="footer-blob"></div>
      <div class="footer-top">
        <div class="footer-brand">
          <div class="logo">🐕 TailScan</div>
          <p>Cada cola merece ser feliz. Conectamos mascotas, familias y comunidad. 🐾</p>
        </div>
        <div class="footer-col">
          <h4>NAVEGACIÓN</h4>
          <a href="#" @click.prevent="irAInicio">Inicio</a>
          <a href="#" @click.prevent="irAGenerarQR">Registrar Mascota</a>
          <a href="#">Adoptar</a>
          <a href="#">Servicios</a>
        </div>
        <div class="footer-col">
          <h4>COMUNIDAD</h4>
          <a href="#">Consejos</a>
          <a href="#" @click.prevent="irAlMapa">Reportar mascota perdida</a>
          <a href="#">Donar</a>
          <a href="#">Nuestro equipo</a>
        </div>
        <div class="footer-col">
          <h4>SÍGUENOS</h4>
          <div class="socials">
            <a href="#">📱</a>
            <a href="#">📷</a>
            <a href="#">🎵</a>
            <a href="#">✉️</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© 2026 TailScan. Todos los derechos reservados.</span>
        <span>Hecho con 🐾 por el equipo TailScan</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const irAInicio = () => router.push('/home');
const irAGenerarQR = () => router.push('/generador-qr');
const irAlMapa = () => router.push('/mapa');

// Datos de consejos
const consejos = ref([
  {
    id: 1,
    tipo: 'perro',
    titulo: 'Cómo reducir la ansiedad por separación',
    descripcion: 'Usa juguetes interactivos y deja música suave cuando salgas de casa.',
    autor: 'María G.',
    avatar: 'https://i.pravatar.cc/40?img=47',
    fecha: 'Hace 2 días',
    emoji: '🐶'
  },
  {
    id: 2,
    tipo: 'gato',
    titulo: 'Enriquecimiento ambiental para gatos',
    descripcion: 'Instala estantes en las paredes y usa cajas de cartón para estimular su curiosidad.',
    autor: 'Carlos R.',
    avatar: 'https://i.pravatar.cc/40?img=12',
    fecha: 'Hace 4 días',
    emoji: '🐱'
  }
]);

const enviarConsejo = () => {
  alert('✅ ¡Tu consejo ha sido enviado! Gracias por compartir.');
};
</script>

<style scoped>
:root {
  --blue-900: #0d1f6e;
  --blue-700: #1e40c9;
  --blue-500: #2f6bf0;
  --orange-500: #ff7a1a;
  --orange-600: #f2600a;
  --bg: #f5f7fc;
  --card-bg: #ffffff;
  --text-dark: #0d1f6e;
  --text-gray: #5b6478;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.consejos-container {
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: var(--bg);
  color: var(--text-dark);
  overflow-x: hidden;
  min-height: 100vh;
}

a {
  text-decoration: none;
  color: inherit;
}

/* ===== HEADER ===== */
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 60px;
  background: #f7f9fd;
  position: relative;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 800;
}
.logo svg {
  width: 38px;
  height: 38px;
}
.logo .tail {
  color: var(--blue-700);
}
.logo .scan {
  color: var(--orange-500);
}

nav {
  display: flex;
  gap: 40px;
  font-weight: 600;
  color: var(--blue-900);
}
nav a {
  padding-bottom: 6px;
  position: relative;
  font-size: 15px;
  cursor: pointer;
}
nav a.active {
  color: var(--orange-500);
}
nav a.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 2px;
  background: var(--orange-500);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}
.bell {
  position: relative;
  width: 22px;
  height: 22px;
  color: var(--blue-900);
  font-size: 20px;
}
.bell .dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background: var(--orange-500);
  border-radius: 50%;
}
.login-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--blue-500), var(--blue-700));
  color: #fff;
  padding: 12px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
}

/* ===== HERO ===== */
.hero-wrap {
  position: relative;
  padding: 60px 60px 80px;
  overflow: hidden;
}

.blob-left {
  position: absolute;
  left: -220px;
  top: 120px;
  width: 520px;
  height: 520px;
  background: radial-gradient(circle at 30% 30%, #dbe6ff, #b9cdfd);
  border-radius: 50%;
  z-index: 0;
  opacity: 0.6;
}
.blob-right {
  position: absolute;
  right: -260px;
  top: -140px;
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #ff9a4d, #ff7a1a);
  border-radius: 45% 55% 60% 40% / 50% 45% 55% 50%;
  z-index: 0;
  opacity: 0.85;
}

.dots {
  position: absolute;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  z-index: 1;
}
.dots span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  display: block;
}
.dots.blue span {
  background: var(--blue-500);
}
.dots.orange span {
  background: var(--orange-500);
}
.dots.top-left {
  top: 110px;
  left: 30px;
}
.dots.mid-right {
  top: 420px;
  right: 40px;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 700px;
  margin: 0 auto 50px;
}
.hero-content h1 {
  font-size: 44px;
  font-weight: 800;
  color: var(--blue-900);
  margin-bottom: 18px;
}
.divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 16px;
}
.divider .line {
  width: 60px;
  height: 2px;
  background: var(--orange-500);
  opacity: 0.5;
}
.divider .paw-icon {
  font-size: 18px;
}
.hero-content p {
  font-size: 16px;
  color: var(--text-gray);
  line-height: 1.6;
}

/* ===== FORM CARD ===== */
.form-card {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
  background: var(--card-bg);
  border-radius: 20px;
  padding: 36px 40px;
  box-shadow: 0 20px 50px rgba(20, 40, 120, 0.08);
}
.form-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 700;
  color: var(--blue-900);
  margin-bottom: 22px;
}
.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 18px;
}
.input-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1.5px solid #dbe3f5;
  border-radius: 12px;
  padding: 14px 18px;
  background: #fbfcff;
  color: #8b93a7;
  font-size: 14px;
}
.input-field select {
  border: none;
  background: transparent;
  outline: none;
  color: #8b93a7;
  font-size: 14px;
  width: 100%;
  appearance: none;
  cursor: pointer;
}
.input-field input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  width: 100%;
  color: #333;
}
.textarea-field {
  display: flex;
  gap: 10px;
  border: 1.5px solid #dbe3f5;
  border-radius: 12px;
  padding: 16px 18px;
  background: #fbfcff;
  margin-bottom: 22px;
}
.textarea-field textarea {
  border: none;
  outline: none;
  background: transparent;
  resize: vertical;
  width: 100%;
  min-height: 80px;
  font-family: inherit;
  font-size: 14px;
  color: #333;
}
.textarea-field span.icon {
  color: #8b93a7;
  margin-top: 2px;
}
.input-field span.icon {
  color: #8b93a7;
  display: flex;
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, var(--orange-500), var(--orange-600));
  color: #fff;
  border: none;
  padding: 14px 26px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(255, 122, 26, 0.35);
}

/* ===== SHARED TIPS ===== */
.shared-title {
  text-align: center;
  font-size: 26px;
  font-weight: 800;
  color: var(--blue-900);
  margin: 60px 0 30px;
  position: relative;
  z-index: 2;
}

.cards-wrap {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto 80px;
  padding: 0 60px;
}
.tip-card {
  flex: 1;
  background: var(--card-bg);
  border-radius: 20px;
  padding: 26px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 15px 40px rgba(20, 40, 120, 0.06);
  position: relative;
}
.tip-left {
  flex: 1;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 14px;
}
.badge.dog {
  background: var(--blue-700);
}
.badge.cat {
  background: var(--orange-500);
}
.tip-card h3 {
  font-size: 18px;
  color: var(--blue-900);
  margin-bottom: 10px;
  line-height: 1.3;
}
.tip-card p {
  font-size: 13.5px;
  color: var(--text-gray);
  line-height: 1.6;
  margin-bottom: 18px;
}
.author {
  display: flex;
  align-items: center;
  gap: 10px;
}
.author img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}
.author .name {
  font-size: 13px;
  font-weight: 700;
  color: var(--blue-900);
}
.author .time {
  font-size: 12px;
  color: #9aa2b5;
}
.bookmark {
  position: absolute;
  top: 22px;
  right: 22px;
  color: var(--blue-700);
  font-size: 18px;
}
.tip-illustration {
  width: 150px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 60px;
}

/* ===== FOOTER ===== */
footer {
  position: relative;
  background: linear-gradient(135deg, var(--blue-900), var(--blue-700));
  color: #fff;
  padding: 60px 60px 30px;
  overflow: hidden;
}
.footer-blob {
  position: absolute;
  right: -150px;
  bottom: -150px;
  width: 500px;
  height: 500px;
  background: var(--orange-500);
  opacity: 0.9;
  border-radius: 45% 55% 60% 40% / 50% 45% 55% 50%;
  z-index: 0;
}
.footer-top {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;
}
.footer-brand .logo {
  color: #fff;
  margin-bottom: 14px;
}
.footer-brand .logo .tail,
.footer-brand .logo .scan {
  color: #fff;
}
.footer-brand p {
  max-width: 280px;
  font-size: 14px;
  color: #c9d3f0;
  line-height: 1.6;
}
.footer-col h4 {
  font-size: 14px;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  color: #fff;
}
.footer-col a {
  display: block;
  font-size: 14px;
  color: #c9d3f0;
  margin-bottom: 12px;
  cursor: pointer;
}
.socials {
  display: flex;
  gap: 14px;
}
.socials a {
  width: 38px;
  height: 38px;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.footer-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  margin-top: 40px;
  padding-top: 24px;
  font-size: 13px;
  color: #c9d3f0;
}

@media (max-width: 900px) {
  header {
    padding: 16px 20px;
    flex-wrap: wrap;
    gap: 14px;
  }
  nav {
    order: 3;
    width: 100%;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  .hero-wrap {
    padding: 40px 20px;
  }
  .form-card {
    padding: 24px 20px;
  }
  .form-row {
    flex-direction: column;
  }
  .cards-wrap {
    flex-direction: column;
    padding: 0 20px;
  }
  .footer-top {
    flex-direction: column;
    gap: 30px;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 10px;
  }
}
</style>