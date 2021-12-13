import React from 'react'

import './display-location.styles.scss'

const DisplayLocation = ({data}) => {
    return (
        <div className="display-location">
            <div className="display-location__box">
                <div className="display-location__box__label">IP address</div>
                <div className="display-location__box__value">{data ? data.ip : ''}</div>
            </div>
            <div className="display-location__box">
                <div className="display-location__box__label">Location</div>
                <div className="display-location__box__value">{data ? data.location.region : ''}, {data ? data.location.city : ''}, {data ? data.location.postalCode : ''}</div>
            </div>
            <div className="display-location__box">
                <div className="display-location__box__label">Timezone</div>
                <div className="display-location__box__value">UTC {data ? data.location.timezone : ''}</div>
            </div>
            <div className="display-location__box">
                <div className="display-location__box__label">ISP</div>
                <div className="display-location__box__value">{data ? data.isp : ''}</div>
            </div>
        </div>
    )
}

export default DisplayLocation;