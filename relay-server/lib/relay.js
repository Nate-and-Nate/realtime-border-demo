import { WebSocketServer } from 'ws';
import { RealtimeClient } from '@openai/realtime-api-beta';

import { screenMigrant, updateForm, createForm } from '../../src/firebase.js';

export class RealtimeRelay {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.sockets = new WeakMap();
    this.wss = null;
  }

  listen(port) {
    this.wss = new WebSocketServer({ port });
    this.wss.on('connection', this.connectionHandler.bind(this));
    this.log(`Listening on ws://localhost:${port}`);
  }

  async connectionHandler(ws, req) {
    if (!req.url) {
      this.log('No URL provided, closing connection.');
      ws.close();
      return;
    }

    // Create a new form when connection is established
    const formId = await createForm();
    this.log(`Created new form with ID: ${formId}`);

    // Send formId to client
    ws.send(JSON.stringify({
      type: 'form.created',
      formId: formId
    }));

    // Instantiate new client
    this.log(`Connecting with key "${this.apiKey.slice(0, 3)}..."`);
    const client = new RealtimeClient({ apiKey: this.apiKey });

    client.addTool(
      {
        name: 'updateForm',
        description: 'Updates information about the migrant in the form.',
        parameters: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
              description: 'Field to update (name, age, origin, reason, entryPoint, travelCompanions, healthConditions, seekingAsylum, previousAttempts)',
            },
            value: {
              type: 'string',
              description: 'Value to set for the field',
            }
          },
          required: ['field', 'value'],
        },
      },
      async ({ field, value }) => {
        return true;
      }
    );
    
    client.addTool(
      {
        name: 'screenMigrant',
        description: 'Screens a migrant against the database of known dangerous individuals.',
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Full name of the person',
            },
            age: {
              type: 'string',
              description: 'Age of the person',
            }
          },
          required: ['name', 'age'],
        },
      },
      async ({ name, age }) => {
        return true;
      }
    );

    client.on('conversation.function_call_output', (event) => {
      this.log(`Function call output: ${JSON.stringify(event)}`);
      client.realtime.send('client.conversation.function_call_output', event);
    });
    
    
    // Relay: OpenAI Realtime API Event -> Browser Event
    client.realtime.on('server.*', (event) => {
      this.log(`Relaying "${event.type}" to Client`);
      ws.send(JSON.stringify(event));
    });
    
    client.on('conversation.*', (event) => {
      this.log(`Relaying conversation event "${event.type}" to Client`);
      ws.send(JSON.stringify(event));
    });

    // Relay: Browser Event -> OpenAI Realtime API Event
    // We need to queue data waiting for the OpenAI connection
    const messageQueue = [];
    const messageHandler = (data) => {
      try {
        const event = JSON.parse(data);
        this.log(`Relaying "${event.type}" to OpenAI`);
        client.realtime.send(event.type, event);
      } catch (e) {
        console.error(e.message);
        this.log(`Error parsing event from client: ${data}`);
      }
    };
    ws.on('message', (data) => {
      if (!client.isConnected()) {
        messageQueue.push(data);
      } else {
        messageHandler(data);
      }
    });
    ws.on('close', () => client.disconnect());

    // Connect to OpenAI Realtime API
    try {
      this.log(`Connecting to OpenAI...`);
      await client.connect();
    } catch (e) {
      this.log(`Error connecting to OpenAI: ${e.message}`);
      ws.close();
      return;
    }
    this.log(`Connected to OpenAI successfully!`);
    while (messageQueue.length) {
      messageHandler(messageQueue.shift());
    }
  }

  log(...args) {
    console.log(`[RealtimeRelay]`, ...args);
  }
}
