import { connectToServer } from './socket-client'
import './style.css'

// Este archivo es el punto de entrada: prepara la pantalla y conecta sus
// controles con la lógica del cliente WebSocket.

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div> 
    <h2>WebSocket - Client</h2>

    <input id="jwt-token" placeholder="Json Web Token">
    <button id="btn-connect">Connect</button>

    <span id="server-status" >offline</span>

    <ul id="clients-ul">
      <li>ASDFSADF</li>
    </ul>

    <form id="message-form">
      <input placeholder="message" id="message-input">
    </form>

    <h3>Messages</h3>
    <ul id="messages-ul"></ul>
  </div>
`

// Obtenemos referencias a los elementos que el usuario puede utilizar.
const jwtToken = document.querySelector<HTMLInputElement>('#jwt-token')!
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect')!

btnConnect?.addEventListener('click', () =>{
  // El servidor necesita un token para autenticar la conexión.
  if(jwtToken.value.trim().length <= 0) return alert("Enter a valid token");

  // La conexión solo se inicia después de pulsar el botón y enviar el token.
  connectToServer(jwtToken.value);
})