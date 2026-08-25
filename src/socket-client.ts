import { Manager, Socket } from "socket.io-client";

// Se conserva el socket actual para poder reemplazarlo al reconectar.
let socket: Socket;

export const connectToServer = (token: string) =>{
    // Manager configura la conexión de Socket.IO y envía el token al servidor.
    const manager = new Manager('https://zero4-teslo-shop-x1bt.onrender.com/socket.io/socket.io.min.js', {
        extraHeaders: {
            hola: 'holamundo',
            authentication: token,
        }
    });

    // Quitamos los listeners de una conexión anterior para evitar duplicados.
    socket?.removeAllListeners();
    // El namespace '/' es el canal principal del servidor Socket.IO.
    socket = manager.socket('/');

    addListerners();
}


const addListerners = () => {
    // Referencias a los elementos que se actualizan con eventos del servidor.
    const serverStatusLabel = document.querySelector('#server-status')!;
    const clientsList = document.querySelector('#clients-ul')!;

    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

    // Estos eventos reflejan en pantalla el estado de la conexión.
    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'Connected';
    });

    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'Disconnected';
    });

    // El servidor notifica la lista actual cada vez que cambia el número de clientes.
    socket.on('clients-updated', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach(clientId => {
            clientsHtml += `
                <li>${clientId}</li>
            `
        })

        clientsList.innerHTML = clientsHtml;
    })

    // Interceptamos el formulario para enviar el mensaje sin recargar la página.
    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if(messageInput.value.trim().length <= 0) return;

        // emit envía un evento personalizado junto con sus datos al servidor.
        socket.emit('message-from-client', { 
            id: 'YO!!', message: messageInput.value
        })

        messageInput.value = "";
    })

    // Recibimos mensajes y añadimos cada uno al final de la lista.
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