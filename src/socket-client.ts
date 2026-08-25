/**
 * ==============================================================================
 *  CLIENTE DE WEBSOCKETS (Socket.IO Client)
 * ==============================================================================
 * Socket.IO es una librería que permite la comunicación bidireccional y en tiempo
 * real entre cliente y servidor sobre el protocolo WebSocket (con fallback a HTTP long-polling).
 * 
 * Conceptos clave empleados aquí:
 *  - Manager: Gestiona la conexión de bajo nivel, reconexiones e inyección de cabeceras HTTP.
 *  - Socket: Representa la instancia de comunicación (canal) activa para enviar/recibir eventos.
 */
import { Manager, Socket } from "socket.io-client";

// Variable global interna para guardar la instancia activa del Socket.
let socket: Socket;

/**
 * Establece la conexión con el servidor Socket.IO pasando el token JWT para autenticación.
 * 
 * @param token Token JWT del usuario necesario para que el backend autorice la conexión.
 */
export const connectToServer = (token: string) =>{
    /**
     * 'Manager' crea y administra la conexión con la URL del servidor.
     * extraHeaders: Permite enviar información de autenticación (JWT) en la mano de obra (handshake) inicial HTTP.
     */
    const manager = new Manager('https://zero4-teslo-shop-x1bt.onrender.com/socket.io/socket.io.min.js', {
        extraHeaders: {
            hola: 'holamundo',
            authentication: token, // El servidor verificará este token antes de aceptar la conexión.
        }
    });

    /**
     * socket?.removeAllListeners():
     * Si existía un socket previo de una conexión anterior, eliminamos todos sus oyentes de eventos (listeners)
     * para evitar duplicidad de llamadas (ej: evitar que se reciba un mensaje 2 o más veces al reconectar).
     */
    socket?.removeAllListeners();

    /**
     * manager.socket('/'):
     * Conecta al espacio de nombres (namespace) raíz ('/'). Retorna un objeto 'Socket' listo
     * para escuchar y emitir eventos.
     */
    socket = manager.socket('/');

    // Registra todos los escuchadores de eventos para esta nueva conexión.
    addListerners();
}


/**
 * Suscribe los oyentes de eventos (listeners) del Socket y los eventos del DOM (formulario).
 */
const addListerners = () => {
    // Referencias a los elementos del DOM que serán actualizados en tiempo real
    const serverStatusLabel = document.querySelector('#server-status')!;
    const clientsList = document.querySelector('#clients-ul')!;

    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

    /**
     * socket.on('connect', callback):
     * Evento reservado de Socket.IO que se dispara automáticamente cuando la conexión
     * con el servidor se establece con éxito (Handshake completado y autorizado).
     */
    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'Connected';
    });

    /**
     * socket.on('disconnect', callback):
     * Evento reservado de Socket.IO que se dispara cuando la conexión se interrumpe
     * (caída de red, token inválido o servidor apagado).
     */
    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'Disconnected';
    });

    /**
     * socket.on('clients-updated', callback):
     * Evento personalizado del servidor. El backend emite este evento con la lista
     * actualizada de IDs de los clientes conectados cada vez que alguien entra o sale.
     */
    socket.on('clients-updated', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach(clientId => {
            clientsHtml += `
                <li>${clientId}</li>
            `
        })

        clientsList.innerHTML = clientsHtml;
    })

    /**
     * Escucha del formulario del chat:
     * Cuando el usuario escribe un mensaje y presiona Enter o enviar:
     */
    messageForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Evita que la página se recargue al enviar el formulario.
        if(messageInput.value.trim().length <= 0) return;

        /**
         * socket.emit('nombre-del-evento', payload):
         * Envía un mensaje/evento desde el cliente hacia el servidor WebSocket.
         * El servidor recibirá este objeto { id, message } y lo procesará o retransmitirá.
         */
        socket.emit('message-from-client', { 
            id: 'YO!!', message: messageInput.value
        })

        messageInput.value = ""; // Limpia la caja de texto tras el envío.
    })

    /**
     * socket.on('message-from-client', callback):
     * Escucha cuando el servidor retransmite un mensaje a todos los clientes.
     * Recibe un payload con la información del remitente y el texto.
     */
    socket.on('message-from-client', (payload: {fullName: string, message: string}) =>{
        const newMessage = `
            <li>
                <strong>${payload.fullName}</strong>
                <span>${payload.message}</span>
            </li>
        `;
        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messagesUl.append(li);
    })
}  