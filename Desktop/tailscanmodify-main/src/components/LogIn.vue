<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { insforge } from '../lib/insforgeClient'

const user = ref('')
const password = ref('')
const router = useRouter()

const socialLogin = async (provider) => {
  try {
    const { data, error } = await insforge.auth.signInWithOAuth(provider, {
      redirectTo: `${window.location.origin}/home`,
    })
    if (error) throw error
    if (data?.url) window.location.href = data.url
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

const login = async () => {
  try {
    const { error } = await insforge.auth.signInWithPassword({
      email: user.value,
      password: password.value,
    })
    if (error) throw error
    router.push('/home')
  } catch (error) {
    alert('Error en usuario o contraseña: ' + error.message)
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo-section">
        <img src="/src/assets/img/mascota.png" alt="TailScan" class="dog-icon" />
        <h1>TailScan</h1>
        <p class="welcome">Bienvenido de nuevo 🐾</p>
      </div>

      <form @submit.prevent="login" class="form">
        <div class="input-group">
          <input 
            v-model="user" 
            type="email" 
            placeholder="Correo electrónico" 
            required 
          />
        </div>

        <div class="input-group">
          <input 
            v-model="password" 
            type="password" 
            placeholder="Contraseña" 
            required 
          />
        </div>

        <button type="submit" class="btn-login">
          Iniciar Sesión
        </button>
      </form>

      <div class="social-section">
        <span class="or-text">O continúa con</span>
        
        <button @click="socialLogin('google')" class="btn-social google">
          Google
        </button>
        <button @click="socialLogin('github')" class="btn-social github">
          GitHub
        </button>
      </div>

      <div class="extra-links">
        <a href="#">¿Olvidaste tu contraseña?</a>
        <router-link to="/signin">Crear cuenta nueva</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #114c95 0%, #3799b4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* CARD MÁS PREMIUM */
.login-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 26px;
  padding: 48px 38px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  text-align: center;
  color: #f2eacf;
}

/* LOGO */
.dog-icon {
  width: 70px;
  margin-bottom: 10px;
  transition: transform 0.4s;
}

.dog-icon:hover {
  transform: rotate(10deg) scale(1.05);
}

h1 {
  font-size: 2.4rem;
  margin-bottom: 5px;
}

.welcome {
  font-size: 1rem;
  opacity: 0.85;
  margin-bottom: 25px;
}

/* INPUTS MÁS BONITOS */
.form input {
  width: 100%;
  padding: 15px 18px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid transparent;
  border-radius: 12px;
  color: #fff;
  font-size: 0.95rem;
  margin-bottom: 14px;
  transition: all 0.25s ease;
}

.form input::placeholder {
  color: rgba(255,255,255,0.6);
}

.form input:focus {
  outline: none;
  border: 1px solid #90d2d3;
  background: rgba(255, 255, 255, 0.18);
  box-shadow: 0 0 0 3px rgba(144, 210, 211, 0.2);
}

/* BOTÓN PRINCIPAL 🔥 */
.btn-login {
  width: 100%;
  padding: 15px;
  background: linear-gradient(135deg, #90d2d3, #5bb4c4);
  color: #0f3d7a;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  margin: 10px 0 20px;
  transition: all 0.25s ease;
}

.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.25);
}

.btn-login:active {
  transform: scale(0.97);
}

/* SEPARADOR */
.or-text {
  display: block;
  margin: 18px 0 12px;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
}

/* BOTONES SOCIALES */
.btn-social {
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  font-weight: 500;
  margin-bottom: 10px;
  transition: 0.25s;
}

/* Google */
.google {
  background: #ffffff;
  color: #114c95;
}

.google:hover {
  transform: translateY(-2px);
}

/* GitHub estilo glass */
.github {
  background: rgba(255,255,255,0.12);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
}

.github:hover {
  background: rgba(255,255,255,0.2);
}

/* LINKS */
.extra-links {
  margin-top: 20px;
  font-size: 0.9rem;
}

.extra-links a {
  color: #90d2d3;
  text-decoration: none;
}

.extra-links a:hover {
  text-decoration: underline;
}
</style>