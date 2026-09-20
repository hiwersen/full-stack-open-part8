const { createClient } = require("graphql-ws");
const WebSocket = require("ws");

const client = createClient({
  url: "ws://localhost:4000/",
  webSocketImpl: WebSocket,
});

console.log("Subscribing...");

client.subscribe(
  { query: "subscription { bookAdded { title id } }" },
  {
    next: (data) => console.log("EVENT:", JSON.stringify(data, null, 2)),
    error: (err) => console.error("ERROR:", err),
    complete: () => console.log("DONE"),
  },
);
