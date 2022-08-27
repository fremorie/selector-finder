let SELECTED_ELEMENT

const someFunc = function (element) {
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

    let result = {}

    let _selector = getElementSelector(element)
    let parent = element.parentNode

    while (!isSelectorUnique(_selector) && parent) {
        const parentSelector = getElementSelector(parent)
        _selector = parentSelector + ' ' + _selector
        parent = parent.parentNode

        if (!parent.parentNode) {
            result = {
                unique: false,
                selector: _selector,
            }

            return result
        }
    }

    result = {
        unique: true,
        selector: _selector,
    }

    console.log({result})

    return result
};

function handleSelectedElement() {
    console.log('selection changed!!!')
    chrome.devtools.inspectedWindow.eval(`(${someFunc})($0)`, (res, err) => {
        if (err) {
            console.warn('Error', err);
        } else {
            SELECTED_ELEMENT = res;

            const div = document.getElementById('selector')

            if (div) {
                div.innerText = SELECTED_ELEMENT && SELECTED_ELEMENT.selector
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
