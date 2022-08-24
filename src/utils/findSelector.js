import React from 'react'
import ReactDOM from 'react-dom'

import Popup from '../components/Popup'

const isSelectorUnique = (selector) => document.querySelectorAll(selector).length === 1

const getElementAttributes = (element) => ({
    id: element.id,
    dataTestId: element.getAttribute('data-testid'),
    dataLocator: element.getAttribute('data-locator'),
    tag: element.tagName.toLowerCase(),
})

const getElementSelector = (element) => {
    const { id, dataTestId, dataLocator, tag } = getElementAttributes(element)

    let _selector

    if (id) {
        _selector = `#${id}`.replace('.', '\\.')
    } else if (dataTestId) {
        _selector = `[data-testid="${dataTestId}"]`
    } else if (dataLocator) {
        _selector = `[data-locator="${dataLocator}"]`
    } else {
        _selector = tag.toLowerCase()
    }

    return _selector
}

const displaySelectorPopup = ({selector, unique}) => {
    let modal = document.querySelector('.selector-finder')
    const body = document.querySelector('body')

    if (!modal) {
        modal = document.createElement('div')
        modal.classList.add('selector-finder')
        body.appendChild(modal)
    }

    ReactDOM.render(<Popup selector={selector} isUnique={unique} />, modal)
}

function handleClick(e) {
    if (!e.altKey) return

    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()

    let result = {}

    let _selector = getElementSelector(e.target)
    let parent = e.target.parentNode

    while (!isSelectorUnique(_selector) && parent) {
        const parentSelector = getElementSelector(parent)
        _selector = parentSelector + ' ' + _selector
        parent = parent.parentNode

        if (!parent.parentNode) {
            result = {
                unique: false,
                selector: _selector,
            }

            displaySelectorPopup(result)

            return
        }
    }

    result = {
        unique: true,
        selector: _selector,
    }

    displaySelectorPopup(result)

    return
}

function handleMouseOver(e) {
    const element = e.target

    element.classList.add('selectorCandidate')
}

function handleMouseOut(e) {
    e.target.classList.remove('selectorCandidate')
}

export const init = () => {
    document.onclick = handleClick
    document.onmouseover = handleMouseOver
    document.onmouseout = handleMouseOut
}

init()