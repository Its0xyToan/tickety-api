
# Tickety Api 🎫

A wrapper for [Tickety](https://tickety.top)'s POST api !

## Installation ➕

Install this project with npm !

```bash
  npm install tickety-api
```
    
## Features 🚀

- Listener using express 🧏‍♂️
- Type definition 📜
- Supports ESM and CJS 🥈


## Documentation ❓

```js
import { TicketyClient } from "tickety"
// or
const { TicketyClient } = require "tickety"

const tickety = new TicketyClient({ port: 3000 }) // 3000 is default, you can set it to whatever you want !

// Listen to an event
tickety.on("ready", (port) => { // On ready !
    console.log("Listening on port " + port + " and on \"http://localhost:" + port + "/tickety\"")
})

tickety.on("create", (ticket) => { // When a ticket is created
    console.log(ticket)
    /*
        {
            guild: { id: '10243432342992731', name: 'My Server' },
            channel: { id: '1161743005082992734' },
            user: { id: '713115896805064856', name: 'oxytoan' },
            panel: 'Support',
            type: 'create',
            openTimestamp: 1706717176563 // Only on create event !
        }
    */
})

// Here are all the events disponible:
tickety.on("close", (ticket) => {})
tickety.on("rename", (ticket) => {}) // has a "newName" field !
tickety.on("priority", (ticket) => {}) // has a "priority" field that can be "high", "medium", or "low" !

tickety.listen() // Let's listen to the port plus /tickety
// This means that the full api will be
// localhost:3000/tickety
```


## Authors

- [@Its0xyToan](https://github.com/Its0xyToan) 😀

