# selector-finder

![screencast 2023-01-17 15-01-48](https://user-images.githubusercontent.com/16775590/212919262-5a9b7868-341a-4c98-8efe-d5118a141190.gif)


## What is it?

A devtools extension for Google Chrome that finds CSS selectors for your E2E tests.

Currently it supports only data-attributes, ids and (as a last resort) HTML tags.

_CSS classes are deliberately excluded, as they are not recommended to use in E2E tests.  
Modern websites use CSS assets optimization techniques, which results in CSS classes changing all the time._


<img width="841" alt="e2e tests - Google Search 2023-01-17 15-12-28" src="https://user-images.githubusercontent.com/16775590/212921559-46cf5809-15a0-4111-b180-9d929b17d944.png">


Sometimes it's impossible to find a unique selector for the element. Be careful when using such selectors.


<img width="742" alt="e2e tests - Google Search 2023-01-17 15-14-35" src="https://user-images.githubusercontent.com/16775590/212921562-760c0222-9937-4b24-907b-520c1e7f0c3c.png">
