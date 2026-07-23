<script setup>

import { ref } from 'vue'

import QRCode from 'qrcode'

import axios from 'axios'

import { useRouter } from 'vue-router'
 
const router = useRouter()

const nombreMascota = ref('')

const nombreDueno = ref('')

const telefono = ref('')

const preview = ref('')

const qrCanvas = ref(null)

const qrGenerado = ref(false)

const imagenBase64 = ref('')

const cargando = ref(false)

const enlaceImagen = ref('')
 
const IMGBB_API_KEY = '44d37b262c28ad52a5660092ae4b9686'
 
const onImageChange = (e) => {

  const file = e.target.files[0]

  if (file) {

    const reader = new FileReader()

    reader.onload = (event) => {

      preview.value = event.target.result

      imagenBase64.value = event.target.result.split(',')[1]

    }

    reader.readAsDataURL(file)

  }

}
 
const subirImagen = async () => {

  const formData = new FormData()

  formData.append('image', imagenBase64.value)

  formData.append('key', IMGBB_API_KEY)
 
  try {

    const response = await axios.post('https://api.imgbb.com/1/upload', formData)

    return response.data.data.url

  } catch (error) {

    console.error('Error al subir:', error)

    return null

  }

}
 
const crearQR = async () => {

  if (!nombreMascota.value || !nombreDueno.value || !telefono.value) {

    alert('Completa todos los campos')

    return

  }
 
  if (!imagenBase64.value) {

    alert('⚠️ Debes subir una foto de la mascota')

    return

  }
 
  cargando.value = true
 
  const enlace = await subirImagen()
 
  if (!enlace) {

    cargando.value = false

    alert('❌ Error al subir la imagen. Probá de nuevo.')

    return

  }
 
  enlaceImagen.value = enlace
 
  let textoQR = `🐕 ${nombreMascota.value}\n`

  textoQR += `👤 ${nombreDueno.value}\n`

  textoQR += `📞 ${telefono.value}\n`

  textoQR += `📷 ${enlace}`
 
  console.log('📏 Tamaño del QR:', textoQR.length, 'caracteres')
 
  try {

    await QRCode.toCanvas(qrCanvas.value, textoQR, {

      width: 300,

      margin: 2,

      color: { dark: '#114c95', light: '#ffffff' }

    })

    qrGenerado.value = true

    cargando.value = false
 
    alert(`✅ QR generado!\n\n📷 Imagen subida a:\n${enlace}`)

  } catch (err) {

    cargando.value = false

    alert('❌ Error al generar el QR')

  }

}
 
const descargarQR = () => {

  const canvas = qrCanvas.value

  if (canvas) {

    const link = document.createElement('a')

    link.download = `qr-${nombreMascota.value || 'mascota'}.png`

    link.href = canvas.toDataURL('image/png')

    link.click()

  }

}
 
const volver = () => {

  router.push('/home')

}
</script>
 
<template>
<div class="qr-page">
<!-- Decoraciones de fondo -->
<div class="bg-blob bg-blob-left"></div>
<div class="bg-blob bg-blob-right"></div>
<div class="dots dots-left">
<span v-for="n in 12" :key="`dl-${n}`"></span>
</div>
<div class="dots dots-right">
<span v-for="n in 12" :key="`dr-${n}`"></span>
</div>
<span class="paw-float paw-1">🐾</span>
<span class="paw-float paw-2">🐾</span>
<span class="paw-float paw-3">🐾</span>
 
    <div class="qr-container">
<div class="header">
<div class="logo-badge">
<img src="/src/assets/img/mascota.png" alt="TailScan" class="logo-img" />
</div>
<h1><span class="tail">Tail</span><span class="scan">Scan</span></h1>
<p class="subtitle">Generador de QR para tu mascota</p>
<div class="header-divider">
<span class="line"></span>
<span class="paw-icon">🐾</span>
<span class="line"></span>
</div>
</div>
 
      <form @submit.prevent class="form">
<div class="card-block">
<div class="card-title">
<span class="icon-circle icon-circle-blue">💬</span>
<span>Datos de la mascota</span>
</div>
 
          <div class="input-group">
<label>🐕 Nombre de la Mascota <span class="required">*</span></label>
<input v-model="nombreMascota" type="text" placeholder="Ej: Max" required>
</div>
 
          <div class="input-group">
<label>👤 Nombre del Dueño <span class="required">*</span></label>
<input v-model="nombreDueno" type="text" placeholder="Ej: Juan Pérez" required>
</div>
 
          <div class="input-group">
<label>📞 Teléfono de Contacto <span class="required">*</span></label>
<input v-model="telefono" type="text" placeholder="Ej: 1234-5678" required>
</div>
 
          <div class="input-group">
<label>📷 Foto de la Mascota <span class="required">*</span></label>
<label class="file-upload">
<input type="file" accept="image/*" @change="onImageChange" required>
<span class="icon-circle icon-circle-orange small">📁</span>
<span>Elegir archivo</span>
</label>
<small class="hint">La imagen se subirá a ImgBB y se acortará el enlace</small>
</div>
 
          <div class="preview">
<img v-if="preview" :src="preview" alt="Vista previa" />
<span v-else class="preview-placeholder">
<span class="preview-icon">📷</span>

              Sube una foto
</span>
</div>
</div>
 
        <button type="button" @click="crearQR" class="btn-generate" :disabled="cargando">
<span v-if="cargando" class="spinner"></span>

          {{ cargando ? 'Subiendo imagen...' : '🐾 Generar Código QR' }}
</button>
 
        <div class="qr-result" :class="{ 'has-qr': qrGenerado }">
<canvas ref="qrCanvas"></canvas>
<p v-if="!qrGenerado" class="qr-placeholder">Tu código QR aparecerá aquí</p>
</div>
 
        <button v-if="qrGenerado" type="button" @click="descargarQR" class="btn-download">

          📥 Descargar QR
</button>
 
        <button type="button" @click="volver" class="btn-volver">

          ⬅️ Volver al inicio
</button>
</form>
</div>
</div>
</template>
 
<style scoped>

* {

  box-sizing: border-box;

}
 
.qr-page {

  position: relative;

  min-height: 100vh;

  overflow: hidden;

  background: linear-gradient(160deg, #eaf2fa 0%, #fbeee0 100%);

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 48px 20px;

  font-family: 'Segoe UI', system-ui, sans-serif;

}
 
/* ---------- Decoración de fondo ---------- */

.bg-blob {

  position: absolute;

  border-radius: 50%;

  filter: blur(2px);

  opacity: 0.55;

  z-index: 0;

}
 
.bg-blob-left {

  width: 420px;

  height: 420px;

  left: -180px;

  bottom: -160px;

  background: radial-gradient(circle at 30% 30%, #cfe2f5, #a9cdec 70%);

}
 
.bg-blob-right {

  width: 380px;

  height: 380px;

  right: -160px;

  top: -140px;

  background: radial-gradient(circle at 60% 40%, #fcd9b6, #f6b978 70%);

}
 
.dots {

  position: absolute;

  display: grid;

  grid-template-columns: repeat(4, 1fr);

  gap: 10px;

  z-index: 0;

}
 
.dots span {

  width: 6px;

  height: 6px;

  border-radius: 50%;

  display: block;

}
 
.dots-left {

  top: 60px;

  left: 40px;

}
 
.dots-left span {

  background: #114c95;

  opacity: 0.35;

}
 
.dots-right {

  bottom: 60px;

  right: 40px;

}
 
.dots-right span {

  background: #f2994a;

  opacity: 0.4;

}
 
.paw-float {

  position: absolute;

  font-size: 1.6rem;

  opacity: 0.25;

  z-index: 0;

}
 
.paw-1 { top: 12%; left: 8%; transform: rotate(-15deg); }

.paw-2 { bottom: 18%; left: 12%; transform: rotate(10deg); font-size: 1.2rem; }

.paw-3 { top: 20%; right: 10%; transform: rotate(20deg); }
 
/* ---------- Contenedor principal ---------- */

.qr-container {

  position: relative;

  z-index: 1;

  background: #ffffff;

  border-radius: 28px;

  padding: 44px 40px;

  width: 100%;

  max-width: 480px;

  box-shadow: 0 25px 60px rgba(17, 76, 149, 0.15);

  text-align: center;

}
 
.header {

  margin-bottom: 28px;

}
 
.logo-badge {

  width: 68px;

  height: 68px;

  margin: 0 auto 12px;

  border-radius: 50%;

  background: linear-gradient(135deg, #eaf2fa, #fdecd9);

  display: flex;

  align-items: center;

  justify-content: center;

  box-shadow: inset 0 0 0 2px rgba(17, 76, 149, 0.08);

}
 
.logo-img {

  width: 40px;

}
 
h1 {

  font-size: 2.1rem;

  font-weight: 800;

  margin: 0;

  letter-spacing: -0.01em;

}
 
.tail {

  color: #114c95;

}
 
.scan {

  color: #f2994a;

}
 
.subtitle {

  font-size: 1rem;

  color: #5a6b7a;

  margin: 6px 0 0;

}
 
.header-divider {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  margin-top: 14px;

}
 
.header-divider .line {

  width: 40px;

  height: 2px;

  border-radius: 2px;

  background: linear-gradient(90deg, #114c95, #f2994a);

  opacity: 0.35;

}
 
.header-divider .paw-icon {

  font-size: 0.9rem;

  opacity: 0.7;

}
 
/* ---------- Formulario ---------- */

.form {

  width: 100%;

}
 
.card-block {

  background: #f7fafc;

  border: 1.5px solid #eaf1f7;

  border-radius: 20px;

  padding: 22px 20px;

  margin-bottom: 20px;

}
 
.card-title {

  display: flex;

  align-items: center;

  gap: 10px;

  font-weight: 700;

  color: #114c95;

  font-size: 1rem;

  margin-bottom: 18px;

  text-align: left;

}
 
.icon-circle {

  width: 30px;

  height: 30px;

  border-radius: 50%;

  display: flex;

  align-items: center;

  justify-content: center;

  font-size: 0.95rem;

  flex-shrink: 0;

}
 
.icon-circle-blue {

  background: #e2edf9;

}
 
.icon-circle-orange {

  background: #fce4cc;

}
 
.icon-circle.small {

  width: 26px;

  height: 26px;

  font-size: 0.85rem;

}
 
.input-group {

  margin-bottom: 16px;

  text-align: left;

}
 
.input-group:last-of-type {

  margin-bottom: 0;

}
 
.input-group label {

  display: block;

  margin-bottom: 6px;

  font-weight: 600;

  color: #114c95;

  font-size: 0.92rem;

}
 
.required {

  color: #f2994a;

}
 
.input-group input[type="text"] {

  width: 100%;

  padding: 12px 16px;

  background: #ffffff;

  border: 1.5px solid #dce6ef;

  border-radius: 12px;

  color: #1c2b3a;

  font-size: 1rem;

  transition: all 0.2s;

}
 
.input-group input[type="text"]:focus {

  outline: none;

  border-color: #114c95;

  background: #ffffff;

  box-shadow: 0 0 0 3px rgba(17, 76, 149, 0.12);

}
 
.file-upload {

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  padding: 12px 18px;

  background: #ffffff;

  border: 1.5px dashed #f2c391;

  border-radius: 12px;

  cursor: pointer;

  color: #f2994a;

  font-weight: 600;

  transition: all 0.2s;

}
 
.file-upload:hover {

  background: #fff6ec;

  border-color: #f2994a;

}
 
.file-upload input[type="file"] {

  display: none;

}
 
.hint {

  color: #9aa9b6;

  display: block;

  margin-top: 6px;

  font-size: 0.82rem;

}
 
.preview {

  border: 2px dashed #dce6ef;

  border-radius: 14px;

  min-height: 110px;

  display: flex;

  justify-content: center;

  align-items: center;

  background: #ffffff;

  margin-top: 16px;

  overflow: hidden;

}
 
.preview img {

  max-width: 96px;

  max-height: 96px;

  border-radius: 10px;

  object-fit: contain;

}
 
.preview-placeholder {

  color: #9aa9b6;

  font-size: 0.88rem;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 4px;

}
 
.preview-icon {

  font-size: 1.4rem;

  opacity: 0.6;

}
 
/* ---------- Botones ---------- */

.btn-generate {

  width: 100%;

  padding: 16px;

  background: linear-gradient(135deg, #114c95, #1a63bd);

  color: #ffffff;

  font-weight: 700;

  font-size: 1.02rem;

  border: none;

  border-radius: 50px;

  cursor: pointer;

  margin: 4px 0 18px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;

  transition: all 0.25s;

}
 
.btn-generate:hover:not(:disabled) {

  transform: translateY(-2px);

  box-shadow: 0 12px 24px rgba(17, 76, 149, 0.3);

}
 
.btn-generate:disabled {

  background: #a9b4bf;

  cursor: not-allowed;

}
 
.spinner {

  width: 16px;

  height: 16px;

  border: 2px solid rgba(255, 255, 255, 0.4);

  border-top-color: #ffffff;

  border-radius: 50%;

  animation: spin 0.7s linear infinite;

}
 
@keyframes spin {

  to { transform: rotate(360deg); }

}
 
.btn-download {

  width: 100%;

  padding: 14px;

  background: linear-gradient(135deg, #f2994a, #e6832a);

  color: #ffffff;

  font-weight: 700;

  font-size: 1rem;

  border: none;

  border-radius: 50px;

  cursor: pointer;

  margin-top: 12px;

  transition: all 0.25s;

}
 
.btn-download:hover {

  transform: translateY(-2px);

  box-shadow: 0 12px 24px rgba(242, 153, 74, 0.3);

}
 
.btn-volver {

  width: 100%;

  padding: 14px;

  background: #eef2f6;

  color: #5a6b7a;

  font-weight: 600;

  font-size: 1rem;

  border: none;

  border-radius: 50px;

  cursor: pointer;

  margin-top: 12px;

  transition: all 0.25s;

}
 
.btn-volver:hover {

  background: #e2e8ee;

  color: #114c95;

  transform: translateY(-2px);

}
 
/* ---------- Resultado QR ---------- */

.qr-result {

  padding: 24px;

  background: #f7fafc;

  border: 1.5px dashed #dce6ef;

  border-radius: 18px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  min-height: 100px;

}
 
.qr-result.has-qr {

  background: #ffffff;

  border: 1.5px solid #eaf1f7;

  box-shadow: 0 8px 20px rgba(17, 76, 149, 0.08);

}
 
.qr-placeholder {

  color: #9aa9b6;

  font-size: 0.9rem;

  margin: 0;

}
 
@media (max-width: 520px) {

  .qr-container {

    padding: 32px 22px;

  }
 
  h1 {

    font-size: 1.8rem;

  }

}
</style>