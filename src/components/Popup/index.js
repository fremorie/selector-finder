import React from 'react'

import './styles.css'

const Popup = ({selector, isUnique}) => {
    return (
        <div className="modalDialog">
            <div className="title">
                {isUnique
                    ? <>Unique selector:</>
                    : <>Couldn't find a unique selector :(<br/>Next best thing:</>
                }
            </div>
            <div className="selector">
                <div className="selectorCode">{selector}</div>
            </div>
        </div>
    )
}

export default Popup