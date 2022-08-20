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

const removeChildren = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild)
    }
}

const displaySelectorPopup = ({selector, unique}) => {
    let modal = document.querySelector('.modalDialog')
    if (modal) {
        removeChildren(modal)
    } else {
        modal = document.createElement('div')
        modal.classList.add('modalDialog')
    }

    const br = document.createElement('br')

    const title = document.createElement('div')
    const titleNode = document.createTextNode(
        unique
            ? 'Unique selector:'
            : 'Coudln\'t find a unique selector :(\n Best I could do:'
    )
    title.classList.add('title')
    title.appendChild(titleNode)
    title.appendChild(br)

    const selectorDiv = document.createElement('div')
    const selectorPre = document.createElement('div')
    selectorPre.classList.add('selectorCode')
    const selectorNode = document.createTextNode(selector)
    selectorDiv.classList.add('selector')
    selectorPre.appendChild(selectorNode)
    selectorDiv.appendChild(selectorPre)

    modal.appendChild(title)
    modal.appendChild(selectorDiv)

    const body = document.querySelector('body')
    body.appendChild(modal)
}

const clearModal = () => {
    const modalNode = document.querySelector('.modalDialog')
    if (modalNode) {
        removeChildren(modalNode)
        const searchPlaceholder = document.createTextNode('Looking for selector...')
        modalNode.appendChild(searchPlaceholder)
    }
}

function handleClick(e) {
    if (!e.altKey) return

    clearModal()

    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()

    let result = {}

    console.log('Looking for a selector...')

    let _selector = getElementSelector(e.target)
    let parent = e.target.parentNode

    while (!isSelectorUnique(_selector) && parent) {
        const parentSelector = getElementSelector(parent)
        _selector = parentSelector + ' ' + _selector
        parent = parent.parentNode

        if (!parent.parentNode) {
            console.log('Could not find a unique selector :(\nBest I could do:')
            result = {
                unique: false,
                selector: _selector,
            }

            displaySelectorPopup(result)

            return
        }
    }

    console.log(`\'${_selector}\'`)
    result = {
        unique: true,
        selector: _selector,
    }

    displaySelectorPopup(result)

    return
}

document.onclick = handleClick

function handleMouseOver(e) {
    const element = e.target

    element.classList.add('selectorCandidate')
}

function handleMouseOut(e) {
    e.target.classList.remove('selectorCandidate')
}

document.onmouseover = handleMouseOver
document.onmouseout = handleMouseOut
