<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { insforge } from '../lib/insforgeClient'

const fullname = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()

const register = async (e) => {
  e.preventDefault()

  if (password.value.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres')
    return
  }
  if (password.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden')
    return
  }

  try {
    const { error } = await insforge.auth.signUp({
      email: email.value,
      password: password.value,
      name: fullname.value
    })

    if (error) throw error

    alert('¡Registro exitoso! Revisa tu correo para verificar tu cuenta.')
    router.push('/')
  } catch (error) {
    alert('Error al registrarse: ' + error.message)
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <div class="logo-section">
        <img src="/src/assets/img/mascota.png" alt="TailScan" class="dog-icon" />
        <h1>TailScan</h1>
        <p class="welcome">Crear Cuenta 🐾</p>
      </div>

      <form @submit="register" class="form">
        <div class="input-group">
          <input v-model="fullname" type="text" placeholder="Nombre completo" required>
        </div>
        <div class="input-group">
          <input v-model="username" type="text" placeholder="Usuario" required>
        </div>
        <div class="input-group">
          <input v-model="email" type="email" placeholder="Correo electrónico" required>
        </div>
        <div class="input-group">
          <input v-model="password" type="password" placeholder="Contraseña" required>
        </div>
        <div class="input-group">
          <input v-model="confirmPassword" type="password" placeholder="Confirmar contraseña" required>
        </div>

        <button type="submit" class="btn-register">
          Registrarse
        </button>
      </form>

      <div class="footer-links">
        <p>¿Ya tienes cuenta? <router-link to="/">Iniciar sesión</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #114c95 0%, #3799b4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.register-card {
  background: rgba(242, 234, 207, 0.22);
  backdrop-filter: blur(22px);
  border: 1px solid rgba(242, 234, 207, 0.5);
  border-radius: 28px;
  padding: 52px 42px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 25px 60px rgba(17, 76, 149, 0.5);
  text-align: center;
  color: #f2eacf;
}

.logo-section {
  margin-bottom: 32px;
}

.dog-icon {
  width: 85px;
  margin-bottom: 12px;
}

h1 {
  font-size: 2.6rem;
  font-weight: 700;
  margin: 0 0 8px;
}

.welcome {
  font-size: 1.15rem;
  opacity: 0.9;
}

.form {
  width: 100%;
}

.input-group {
  margin-bottom: 18px;
}

.form input {
  width: 100%;
  padding: 17px 20px;
  background: rgba(255, 255, 255, 0.25);
  border: 1px solid rgba(242, 234, 207, 0.55);
  border-radius: 16px;
  color: #f2eacf;
  font-size: 1.05rem;
  box-sizing: border-box;
}

.form input:focus {
  outline: none;
  border-color: #f2eacf;
  background: rgba(255, 255, 255, 0.35);
}

.btn-register {
  width: 100%;
  padding: 17px;
  background: #f2eacf;
  color: #114c95;
  font-weight: 600;
  font-size: 1.15rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.3s;
}

.btn-register:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(242, 234, 207, 0.5);
}

.footer-links {
  margin-top: 35px;
  font-size: 0.98rem;
}

.footer-links a,
.footer-links router-link {
  color: #90d2d3;
  text-decoration: none;
}
</style>