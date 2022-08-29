const someFunc = function (element) {
    const isSelectorUnique = (selector) => document.querySelectorAll(selector).length === 1

    const getElementAttributes = (element) => ({
        id: element && element.id,
        dataTestId: element && element.getAttribute('data-testid'),
        dataLocator: element && element.getAttribute('data-locator'),
        tag: element && element.tagName && element.tagName.toLowerCase(),
    })

    /**
     * attribute: data-testid | data-locator | tag
     * */
    function getIndex(node, prop) {
        let i=1;

        const getElementProperty = (element) => {
            return prop.includes('data')
                ? element.getAttribute(prop)
                : element.tagName && element.tagName.toLowerCase()
        }

        let property = getElementProperty(node)

        const siblings = node.parentNode.childNodes

        let twinsCount = 0

        for (const sibling of siblings) {
            if (getElementProperty(sibling) === property) {
                twinsCount++
            }
        }

        if (twinsCount === 1) {
            return null
        }

        while(node.previousSibling) {
            node = node.previousSibling;
            if(node.nodeType === 1 && (property == getElementProperty(node))) {
                i++;
            }
        }

        return i;
    }

    const getElementSelector = (element) => {
        const { id, dataTestId, dataLocator, tag } = getElementAttributes(element)

        if (id) {
            return {
                selector: `#${id}`.replace('.', '\\.'),
                prop: 'id',
            }
        } else if (dataTestId) {
            return {
                selector: `[data-testid="${dataTestId}"]`,
                prop: 'data-testid',
            }
        } else if (dataLocator) {
            return {
                selector: `[data-locator="${dataLocator}"]`,
                prop: 'data-locator',
            }
        } else {
            return {
                selector: tag,
                prop: 'tag',
            }
        }
    }

    let {selector: _selector, prop} = getElementSelector(element)

    if (isSelectorUnique(_selector)) {
        return {
            unique: true,
            selector: _selector,
        }
    }

    const index = getIndex(element, prop)

    if (index !== null) {
        _selector = `${_selector}:nth-of-type(${index})`

        if (isSelectorUnique(_selector)) {
            return {
                unique: true,
                selector: _selector,
            }
        }
    }

    let parent = element.parentNode

    while(parent) {
        const { selector: parentSelector, prop: parentProp} = getElementSelector(parent)
        let selectorCandidate = parentSelector + ' ' + _selector

        if (isSelectorUnique(selectorCandidate)) {
            return {
                unique: true,
                selector: selectorCandidate
            }
        }

        const index = getIndex(parent, parentProp)

        if (index !== null) {
            selectorCandidate = `${parentSelector}:nth-of-type(${index}) ${_selector}`

            if (isSelectorUnique(selectorCandidate)) {
                return {
                    unique: true,
                    selector: selectorCandidate
                }
            }
        }

        _selector = selectorCandidate
        parent = parent.parentNode

        if (!parent || parent.tagName === 'BODY') {
            return {
                unique: false,
                selector: _selector,
            }
        }
    }

    return {
        unique: true,
        selector: _selector,
    }
};

function handleSelectedElement() {
    chrome.devtools.inspectedWindow.eval(`(${someFunc})($0)`, (res, err) => {
        if (err) {
            console.warn('Error', err);
        } else {

            const { selector, unique } = res

            const welcomeMessage = document.getElementById('welcome-message')
            if (welcomeMessage) {
                welcomeMessage.remove()
            }

            const div = document.getElementById('selector')

            if (div) {
                div.innerHTML = `<div>\'${selector.split(' ').map(node => `<span>${node}</span>`).join('&#32;')}\'</div>`;
                const isUniqueDiv = document.createElement('div')
                isUniqueDiv.classList.add('is-unique-container')
                isUniqueDiv.innerHTML = unique
                    ? `<div class="success-message">This selector is unique</div>`
                    : `<div class="fail-message"><span>${String.fromCodePoint(0x26A0)}</span>&nbsp;This selector is <strong>not</strong> unique</div>`
                div.appendChild(isUniqueDiv)
            }
        }
    });
}

chrome.devtools.panels.elements.createSidebarPane("Selector Wizard",
    function(sidebar) {
        sidebar.setPage("html/Sidebar.html");
        sidebar.setHeight("8ex");

        chrome.devtools.panels.elements.onSelectionChanged.addListener(handleSelectedElement)
    })
