import { connectToServer } from './socket-client'
import './style.css'

/**
 * ==============================================================================
 *  PUNTO DE ENTRADA PRINCIPAL (Vite + TypeScript)
 * ==============================================================================
 * Vite utiliza este archivo para inicializar la aplicación web.
 * Aquí construimos la interfaz de usuario en el DOM y gestionamos las interacciones
 * iniciales (como capturar el token JWT y lanzar la conexión por WebSockets).
 */

// Inyección del marcado HTML base en el contenedor principal ('#app')
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div> 
    <h2>WebSocket - Client</h2>

    <!-- Entrada para que el usuario ingrese su JWT Token para autenticarse en el servidor -->
    <input id="jwt-token" placeholder="Json Web Token">
    <button id="btn-connect">Connect</button>

    <!-- Muestra el estado actual de la conexión en tiempo real (Connected / Disconnected) -->
    <span id="server-status" >offline</span>

    <!-- Lista de clientes/usuarios conectados actualmente al servidor WebSocket -->
    <ul id="clients-ul">
      <li>ASDFSADF</li>
    </ul>

    <!-- Formulario para enviar mensajes al chat -->
    <form id="message-form">
      <input placeholder="message" id="message-input">
    </form>

    <h3>Messages</h3>
    <!-- Lista donde se van agregando dinámicamente los mensajes recibidos -->
    <ul id="messages-ul"></ul>
  </div>
`

// Obtenemos referencias a los elementos HTML para interactuar con ellos
const jwtToken = document.querySelector<HTMLInputElement>('#jwt-token')!
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect')!

// Event Listener del botón de conexión:
// 1. Valida que el usuario haya escrito un token JWT.
// 2. Llama a la función connectToServer(...) delegando la lógica a Socket.IO.
btnConnect?.addEventListener('click', () =>{
  if(jwtToken.value.trim().length <= 0) return alert("Enter a valid token");

  // Inicia la conexión enviando el JWT introducido por el usuario
  connectToServer(jwtToken.value);
})