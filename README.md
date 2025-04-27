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
- Adapters for existing web servers 🔌


## Documentation ❓

```js
import { TicketyClient } from "tickety"
// or
const { TicketyClient } = require("tickety")

// Configuration options:
// - key: Your API key (required)
// - port: Port to listen on (default: 3000)
// - route: Custom route for the webhook endpoint (default: "tickety")
const tickety = new TicketyClient({ 
  port: 3000,  // Optional, default is 3000
  key: "YOUR_API_KEY", // Required
  route: "tickety" // Optional, default is "tickety"
})

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

## Using with Existing Web Servers 🔌

Tickety now supports integration with existing web servers via adapters!

<details>
<summary>Express Example</summary>

```javascript
import express from 'express';
import { TicketyClient } from 'tickety-api';

const app = express();
app.use(express.json());

const tickety = new TicketyClient({
  key: 'your-api-key',
});

// Register the handler on your existing Express app
app.post('/webhook/tickety', tickety.createExpressHandler());

// Listen for events
tickety.on('create', (ticket) => {
  console.log('Ticket created:', ticket);
});

// Your existing app.listen() call
app.listen(8080);
```
</details>

<details>
<summary>Fastify Example</summary>

```javascript
import Fastify from 'fastify';
import { TicketyClient } from 'tickety-api';

const fastify = Fastify();
const tickety = new TicketyClient({
  key: 'your-api-key',
});

// Create a reusable handler
const handler = tickety.createHandler();

// Register with Fastify
fastify.post('/webhook/tickety', (request, reply) => {
  const response = handler({
    body: request.body,
    headers: request.headers
  });
  
  return reply.status(response.status).send(response.payload);
});

// Listen for events
tickety.on('create', (ticket) => {
  console.log('New ticket created:', ticket);
});

// Start your Fastify server
fastify.listen({ port: 8080 });
```
</details>

<details>
<summary>Hono Example (for Edge Environments)</summary>

```javascript
import { Hono } from 'hono';
import { TicketyClient } from 'tickety-api';

const app = new Hono();
const tickety = new TicketyClient({
  key: 'your-api-key',
});

// Create a reusable handler
const handler = tickety.createHandler();

// Register with Hono
app.post('/webhook/tickety', async (c) => {
  const body = await c.req.json();
  const response = handler({
    body,
    headers: Object.fromEntries(c.req.headers)
  });
  
  return c.json(response.payload, response.status);
});

// Listen for events
tickety.on('create', (ticket) => {
  console.log('Ticket created:', ticket);
});

// Export for edge deployment
export default app;
```
</details>

<details>
<summary>Native Node.js HTTP Server</summary>

```javascript
import http from 'node:http';
import { TicketyClient } from 'tickety-api';

const tickety = new TicketyClient({
  key: 'your-api-key',
});

// Create a reusable handler
const handler = tickety.createHandler();

// Create a native HTTP server
const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/webhook/tickety') {
    // Parse the body manually for native HTTP
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    
    const body = JSON.parse(Buffer.concat(chunks).toString());
    
    const response = handler({
      body,
      headers: req.headers
    });
    
    res.statusCode = response.status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response.payload));
  } else {
    // Handle other routes
  }
});

// Listen for events
tickety.on('create', (ticket) => {
  console.log('New ticket:', ticket);
});

server.listen(8080);
```
</details>

## Adapter API Reference

The adapter API consists of three main methods:

<details>
<summary>handleRequest(options)</summary>

Core method that handles Tickety webhook requests.

```typescript
interface RequestOptions {
  body: any; // The request body
  headers: Record<string, string>; // Request headers
}

interface RequestResponse {
  status: number; // HTTP status code
  payload: Record<string, any>; // Response payload
}

// Usage
const response = tickety.handleRequest({ 
  body: requestBody,
  headers: requestHeaders 
});
```
</details>

<details>
<summary>createExpressHandler()</summary>

Creates a handler function specifically for Express.

```javascript
// Returns a function with signature (req, res) => { ... }
const handler = tickety.createExpressHandler();

// Use with Express
app.post('/webhook/tickety', handler);
```
</details>

<details>
<summary>createHandler()</summary>

Creates a generic handler function.

```javascript
// Returns a function that accepts { body, headers } and returns { status, payload }
const handler = tickety.createHandler();

// Use with any framework
const response = handler({
  body: requestBody,
  headers: requestHeaders
});
```
</details>

## Authors

- [@Its0xyToan](https://github.com/Its0xyToan) 😀
- Little help from [@NotDemonix](https://github.com/notdemonix) ❤️
