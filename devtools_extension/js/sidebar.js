console.log('running sidebar js')

//
// chrome.devtools.inspectedWindow.eval("setSelectedElement($0)",
//     { useContentScriptContext: true }
// );

const evalButton = document.querySelector('#evalButton')
// console.log({evalButton})

evalButton.addEventListener("click", () => {
    console.log('button clicked')
    chrome.devtools.inspectedWindow.eval("setSelectedElement($0)",
        {useContentScriptContext: true})
});