import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";

const ID = '4022d88e30e8';
const AUTH_KEY = "MWNiMjY5dWlk404459961993DCA83AE44BC6E3A6F58906952E7BECA0A5B69DC375C964915ACBC0EA536A0639CB73";
const STATUS_URL = 'https://shelly-77-eu.shelly.cloud/device/status';
const CONTROL_URL = 'https://shelly-77-eu.shelly.cloud/device/relay/control';

function App() {
    const [deviceStatus, setDeviceStatus] = useState({});
    const [shellyActive, setShellyActive] = useState(false);

    useEffect( () => {
        axios.get(`${STATUS_URL}?id=${ID}&auth_key=${AUTH_KEY}`).then(async (res) => {
            const { device_status } = res.data.data;
            const { ison } = device_status.relays[0];

            setDeviceStatus(device_status);
            setShellyActive(ison);
        });
    }, [])

    const togglePower = () => {
        const FormData = require('form-data');
        let data = new FormData();
        data.append('id', ID);
        data.append('turn', shellyActive ? 'off' : 'on');
        data.append('auth_key', AUTH_KEY);
        data.append('channel', '0');

        const headers = data.getHeaders ? data.getHeaders() : { 'Content-Type': 'multipart/form-data' };
        const params = {
            method: 'post',
            maxBodyLength: Infinity,
            url: CONTROL_URL,
            headers,
            data
        };

        axios.request(params)
            .then((res) => {
                console.log(JSON.stringify(res.data));
            })
            .catch((error) => {
                console.log(error);
            });
        setShellyActive(!shellyActive);
    };

    return (
        <div className="App">
            <div>
                <button
                    alt="Bouton d'activation de Shelly"
                    onClick={ togglePower }
                    className={`${shellyActive ? 'power-button active' : 'power-button'}`}
                >
                    { shellyActive ? 'Éteindre Shelly' : 'Allumer Shelly' }
                </button>
            </div>
            <div>
                <h3>Status : </h3>
                <p>Surchauffe : {deviceStatus.overtemperature ? 'Oui 🤒' : 'Non'}</p>
                <p>Température 🌡️ : {deviceStatus.temperature}</p>
            </div>
        </div>
    );
}

export default App;
