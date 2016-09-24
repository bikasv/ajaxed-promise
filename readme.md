# Ajaxed-promise

    A promise based Ajax library for Node.js

`Ajaxed-promise` is promise based ajax library for Node.js with backward compatibility for older browsers. For the browsers that support `ES6 Promises`, Ajax call will return a promise. For the browsers that lacks Promises, the library will fallback to tradional Ajax calls. For browsers IE9 and below, it'll make suitable calls to get Ajax results.

The best part about this library is that the order of call doesn't change for users. Also it quite small library which is just 4Kb, or less than 2Kb when minimized, and ~860 bytes when minimized and gzipped.

### Installation

Install the package by issue the command - 

```
npm i --save-dev ajaxed-promise
```

### Including in code

Include the package by issuing following command 

ES6 module syntax -

```js
import ajax from 'ajaxed-promise';
```

Node.js module syntax -

```js
var ajax = require('ajaxed-promise');
```

### Usage

You can now make various AJAX requests as follows

**GET**

```js
ajax(url)
    .get(data)
    .then(successCallback, failureCallback);
```

**POST**

```js
ajax(url)
    .post(data)
    .then(successCallback, failureCallback);
```

**PUT**

```js
ajax(url)
    .put(data)
    .then(successCallback, failureCallback);
```

**DELETE**

```js
ajax(url)
    .delete(data)
    .then(successCallback, failureCallback);
```

**JSONP**

```js
ajax(url)
    .jsonp()
    .then(successCallback, failureCallback);
```

where various attributes are 

```js
`url` (String) - URL from where data is to be retrieved
`data` (Object) - Data to be sent as a part of AJAX request (details below)
`successCallback` (Function) - Function that will be called when a data is obtained successfully from Ajax call
`failureCallback` (Function) - Function that will be called when Ajax call fails
```

*Data Param*

Sample data for Ajax request is -

```js
{                               // [Required] Except for GET (optional) and JSONP (ignored) calls
    config: {                   // [Optional] Config data to be set for making Ajax call
        timeout: 200,           // [Optional] Timeout before Ajax request is terminated
        credentials: true,      // [Optional] Boolean to decides whether CORS requests should be made
        headers: [              // [Optional] Set Request headers for Ajax calls
            'Access-Control-Allow-Headers': '*',
            'Content-type', 'application/json; charset=UTF-8'
        ]
    },
    payload: {                  // [Reuqired] Except for GET and DELETE (ignored) calls
        urlParam: false,        // [Optional] If set to true, then payload.data is appended to URL itseld
        data: {}                // [Required] Data to be send alongwith URL
    }
}
```

### Example

```js
ajax('http://api.randomuser.me/?results=1')
    .get({
        payload: {
            urlParam: true,
            data: {
                results: 1
            }
        }
    })
    .then(function(data) {
        console.log(data);
    });
```


