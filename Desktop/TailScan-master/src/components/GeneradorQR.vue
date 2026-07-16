<script setup>
import { ref } from 'vue'
import QRCode from 'qrcode'

const nombre = ref('')
const contacto = ref('')
const preview = ref('')
const qrCanvas = ref(null)
const qrGenerado = ref(false)

const onImageChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      preview.value = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

const crearQR = async () => {
  if (!qrCanvas.value || !nombre.value || !contacto.value) {
    alert('Por favor completa el nombre y el contacto')
    return
  }

  const data = `Nombre: ${nombre.value}\nContacto: ${contacto.value}`

  try {
    await QRCode.toCanvas(qrCanvas.value, data, {
      width: 240,
      margin: 2,
      color: {
        dark: '#114c95',
        light: '#ffffff'
      }
    })
    qrGenerado.value = true
  } catch (err) {
    console.error('Error al generar QR:', err)
  }
}
</script>

<template>
  <div class="qr-page">
    <div class="qr-container">
      <div class="header">
        <img src="/src/assets/img/mascota.png" alt="TailScan" class="logo-img" />
        <h1><span class="tail">Tail</span><span class="scan">Scan</span></h1>
        <p class="subtitle">Generador de QR para tu mascota</p>
        <span class="paw-divider">🐾</span>
      </div>

      <form @submit.prevent class="form">
        <div class="input-group">
          <label>Nombre de la Mascota</label>
          <input v-model="nombre" type="text" placeholder="Ej: Max" required>
        </div>

        <div class="input-group">
          <label>Contacto (Teléfono o Email)</label>
          <input v-model="contacto" type="text" placeholder="Ej: 1234567890 o email" required>
        </div>

        <div class="input-group">
          <label>Foto de la Mascota (Opcional)</label>
          <label class="file-upload">
            <input type="file" accept="image/*" @change="onImageChange">
            <span>Elegir archivo</span>
          </label>
        </div>

        <div class="preview">
          <img v-if="preview" :src="preview" alt="Vista previa" />
          <span v-else class="preview-placeholder">Vista previa de la imagen</span>
        </div>

        <button type="button" @click="crearQR" class="btn-generate">
          🐾 Generar Código QR
        </button>

        <div class="qr-result" :class="{ 'has-qr': qrGenerado }">
          <canvas ref="qrCanvas"></canvas>
          <p v-if="!qrGenerado" class="qr-placeholder">Tu código QR aparecerá aquí</p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.qr-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #dceaf5 0%, #fbe6d4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.qr-container {
  background: #ffffff;
  border-radius: 28px;
  padding: 45px 40px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 25px 60px rgba(17, 76, 149, 0.15);
  text-align: center;
}

.header {
  margin-bottom: 30px;
}

.logo-img {
  width: 64px;
  margin-bottom: 10px;
}

h1 {
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
}

.tail {
  color: #114c95;
}

.scan {
  color: #f2994a;
}

.subtitle {
  font-size: 1.05rem;
  color: #5a6b7a;
  margin: 6px 0 4px;
}

.paw-divider {
  display: inline-block;
  font-size: 1rem;
  opacity: 0.6;
  margin-top: 6px;
}

.form {
  width: 100%;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #114c95;
  font-size: 0.95rem;
}

.input-group input[type="text"] {
  width: 100%;
  padding: 14px 18px;
  background: #f6f9fc;
  border: 1.5px solid #dce6ef;
  border-radius: 14px;
  color: #1c2b3a;
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.2s;
}

.input-group input[type="text"]::placeholder {
  color: #9aa9b6;
}

.input-group input[type="text"]:focus {
  outline: none;
  border-color: #3799b4;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(55, 153, 180, 0.15);
}

.file-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  background: #f6f9fc;
  border: 1.5px dashed #cfe0eb;
  border-radius: 14px;
  cursor: pointer;
  color: #3799b4;
  font-weight: 500;
  transition: all 0.2s;
}

.file-upload:hover {
  background: #eef5fa;
  border-color: #3799b4;
}

.file-upload input[type="file"] {
  display: none;
}

.preview {
  border: 2px dashed #dce6ef;
  border-radius: 16px;
  min-height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fbfd;
  margin: 24px 0;
  overflow: hidden;
}

.preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-placeholder {
  color: #9aa9b6;
  font-size: 0.95rem;
}

.btn-generate {
  width: 100%;
  padding: 16px;
  background: #114c95;
  color: #ffffff;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin: 8px 0 24px;
  transition: all 0.25s;
}

.btn-generate:hover {
  background: #0d3d78;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(17, 76, 149, 0.3);
}

.qr-result {
  padding: 24px;
  background: #f9fbfd;
  border: 1.5px solid #eef2f6;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
}

.qr-result.has-qr {
  background: #ffffff;
  border-color: #dce6ef;
}

.qr-placeholder {
  color: #9aa9b6;
  font-size: 0.9rem;
  margin: 0;
}
</style>