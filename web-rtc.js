import { html, css, LitElement } from 'lit';

export class web_rtc extends LitElement {
    static styles = css `
      :host {
        color: red;
      }
    `;
    static get properties() {
        return {
            name: { type: String },
            width: { type: String },
            value: { type: Number }
        }
    }

    constructor() {
        super();
    }

    show() {
        if(web_rtc.init) return;
        web_rtc.init = true;
        var self = this;
        console.log("show:")
        const peers = {}
        const ROOM_ID = 'nana';
        const socket = io.connect('https://webrtc.webduino.io/')
        // (1)
        const myPeer = new Peer(undefined, {
          host: 'peerjs.webduino.io',
          path: '/myapp',
          proxied: true
        })
        // (2)
        myPeer.on('open', id => {
          socket.emit('join-room', ROOM_ID, id)
        })
        // (3) 取得已加入的用戶
        myPeer.on('call', call => {
          console.log("on call");
          //將本身的 stream 送給線上用戶
          const video = document.createElement('video')
          call.answer(video.stream);
          //新進來的用戶送過來的串流
          call.on('stream', userVideoStream => {
            const xx = document.createElement('video')
            xx.srcObject = userVideoStream
            xx.addEventListener('loadedmetadata', () => {
              xx.play();
            })
    
            function onFrame() {
              window.requestAnimationFrame(onFrame);
              var ctx = self.shadowRoot.firstElementChild.getContext('2d');
              ctx.drawImage(xx, 0, 0, 640, 480);
            }
            onFrame();
          })
        })
        socket.on('user-disconnected', userId => {
          location.reload();
        })
    }

    updated() {

    }

    render() {
        return html `<canvas width='640px' height='320px'></canvas>`;
    }
}

customElements.define('web-rtc', web_rtc);
