import {
    html,
    LitElement
} from 'lit';

export class wa_mqtt extends LitElement {
    static get properties() {
        return {
            pub: {
                type: String
            },
            sub: {
                type: String
            },
            set: {
                type: String
            },
            get: {
                type: String
            },
            func: {
                type: String
            }
        }
    }
    constructor() {
        super();
        wa_mqtt.Server = {
            server: 'wss://mqtt1.webduino.io/mqtt',
            userName: 'webduino',
            password: 'webduino'
        }
        wa_mqtt.subs = {}
    }

    async publish(topic, msg) {
        await wa_mqtt.mClient.send({
            'topic': topic,
            'message': '' + msg
        });
    }

    async firstUpdated() {
        var self = this;
        if (!wa_mqtt.mClient) {
            wa_mqtt.isConnect = false;
            wa_mqtt.mClient = new webduino.module.mqttClient();
            await wa_mqtt.mClient.connect(wa_mqtt.Server);
            console.log("mqttClient connect ok");
            wa_mqtt.isConnect = true;
        }
        if (self.pub) {
            var data = self.get.split('.');
            var eleId = data[0];
            var attr = data[1];
            var ele = document.getElementById(eleId);
            if (attr == 'on' && ele.tagName == 'MWC-ICON-BUTTON-TOGGLE') {
                ele.addEventListener('icon-button-toggle-change', function (evt) {
                    wa_mqtt.mClient.send({
                        topic: self.pub,
                        message: "" + evt.detail.isOn
                    });
                })
            } else if (attr == 'input' && ele.tagName == 'MWC-SLIDER') {
                ele.addEventListener('input', function (evt) {
                    wa_mqtt.mClient.send({
                        topic: self.pub,
                        message: "" + parseInt(this.value)
                    })
                })
            } else if (attr == 'checked' && ele.tagName == 'MWC-SWITCH') {
                ele.addEventListener('input', function (evt) {
                    wa_mqtt.mClient.send({
                        topic: self.pub,
                        message: "" + (this.checked != true)
                    })
                })
            }
        }
        if (self.sub) {
            var id = setInterval(async function () {
                if (wa_mqtt.isConnect) {
                    if (!wa_mqtt.subs[self.sub]) {
                        wa_mqtt.subs[self.sub] = [];
                        await wa_mqtt.mClient.onMessage(self.sub,
                            async (msg) => {
                                var evtList = wa_mqtt.subs[self.sub];
                                for (var i = 0; i < evtList.length; i++) {
                                    evtList[i](msg);
                                }
                            });
                    }
                    wa_mqtt.subs[self.sub].push(
                        async (msg) => {
                            var data = self.set.split('.');
                            if (msg == 'true') msg = true
                            if (msg == 'false') msg = false
                            var eleId = data[0],
                                attr = data[1]
                            if (document.getElementById(eleId) == null) {
                                window[eleId][attr](msg);
                            } else {
                                var ele = document.getElementById(eleId);
                                ele[attr] = msg;
                            }
                        }
                    );
                    clearInterval(id);
                }
            }, 100);
        }
    }
    render() {
        return html `<div></div>`;
    }
}
customElements.define('wa-mqtt', wa_mqtt);