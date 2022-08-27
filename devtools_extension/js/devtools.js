const someFunc = function (element) {
    const isSelectorUnique = (selector) => document.querySelectorAll(selector).length === 1

    const getElementAttributes = (element) => ({
        id: element.id,
        dataTestId: element.getAttribute('data-testid'),
        dataLocator: element.getAttribute('data-locator'),
        tag: element.tagName.toLowerCase(),
    })

    /**
     * attribute: data-testid | data-locator | tag
     * */
    function getIndex(node, prop) {
        let i=1;

        const getElementProperty = (element) => {
            return prop.includes('data')
                ? element.getAttribute(prop)
                : element.tagName.toLowerCase()
        }

        let property = getElementProperty(node)

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
                selector: tag.toLowerCase(),
                prop: 'tag',
            }
        }
    }

    let result = {}

    let {selector: _selector, prop} = getElementSelector(element)

    if (isSelectorUnique(_selector)) {
        return {
            unique: true,
            selector: _selector,
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

        const index = getIndex(parent, prop)

        selectorCandidate = `${parentSelector}:nth-of-type(${index}) ${_selector}`

        if (isSelectorUnique(selectorCandidate)) {
            return {
                unique: true,
                selector: selectorCandidate
            }
        }

        _selector = selectorCandidate
        parent = parent.parentNode

        if (!parent.parentNode) {
            return {
                unique: false,
                selector: _selector,
            }
        }
    }

    console.log({result})

    return {
        unique: true,
        selector: _selector,
    }
};

function handleSelectedElement() {
    console.log('selection changed!!!')
    chrome.devtools.inspectedWindow.eval(`(${someFunc})($0)`, (res, err) => {
        if (err) {
            console.warn('Error', err);
        } else {

            const { selector, unique } = res

            const div = document.getElementById('selector')

            if (div) {
                div.innerText = selector
                const isUniqueDiv = document.createElement('div')
                isUniqueDiv.innerText = `Is unique: ${unique}`
                div.appendChild(isUniqueDiv)
            }
        }
    });
}

chrome.devtools.panels.elements.createSidebarPane("DASHAS SIDEBAR",
    function(sidebar) {
        sidebar.setPage("html/Sidebar.html");
        sidebar.setHeight("8ex");

        chrome.devtools.panels.elements.onSelectionChanged.addListener(handleSelectedElement)
    })
