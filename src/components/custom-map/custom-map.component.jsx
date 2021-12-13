import React from 'react'
import  L from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { MapContainer, TileLayer, Marker, Popup } from '@monsonjeremy/react-leaflet'

import Spinner from '../spinner/spinner.component'

import './custom-map.styles.scss'
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const CustomMap = ({data, spinner, zoom = 12}) => {
    const latLng = data ? [data.location.lat, data.location.lng] : [43.60448244287537, 1.4437097635635434];
    const popupDomain = data ? data.as.domain : '';
    const popupIP = data ? data.ip : '';
    return(
        <div className="custom-map">
            {spinner ? <Spinner /> : null }
            <MapContainer center={latLng} zoom={zoom}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors" />
                <Marker position={latLng}>
                    <Popup>{popupDomain}<br/>{popupIP}</Popup>
                </Marker>
            </MapContainer>
        </div>
    )
}
export default CustomMap;