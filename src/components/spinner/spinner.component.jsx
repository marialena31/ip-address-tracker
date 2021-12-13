import React from 'react'

import './spinner.styles.scss'

const Spinner = () => {
    const spinnerRef = React.useRef()
    return (
        <div ref={spinnerRef} className="overlay" style={{visibility: "visible"}}>
            <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export default Spinner;