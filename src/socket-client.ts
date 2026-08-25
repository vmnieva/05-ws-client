import { Manager, Socket } from "socket.io-client";


let socket: Socket;

export const connectToServer = (token: string) =>{

    // const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
    const manager = new Manager('https://zero4-teslo-shop-x1bt.onrender.com/socket.io/socket.io.min.js', {
        extraHeaders: {
            hola: 'holamundo',
            authentication: token,
        }
    });


    // console.log({ socket });

    socket?.removeAllListeners();
    socket = manager.socket('/');

    addListerners();
}


const addListerners = () => {
    const serverStatusLabel = document.querySelector('#server-status')!;
    const clientsList = document.querySelector('#clients-ul')!;

    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

    socket.on('connect', () => {
        serverStatusLabel.innerHTML = 'Connected';
    });

    socket.on('disconnect', () => {
        serverStatusLabel.innerHTML = 'Disconnected';
    });

    socket.on('clients-updated', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach(clientId => {
            clientsHtml += `
                <li>${clientId}</li>
            `
        })

        clientsList.innerHTML = clientsHtml;
    })

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if(messageInput.value.trim().length <= 0) return;

        socket.emit('message-from-client', { 
            id: 'YO!!', message: messageInput.value
        })

        messageInput.value = "";
    })

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