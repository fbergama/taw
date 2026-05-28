# PostmessagesAgent

This Node.js application simulates multiple user profiles using an AI model to
post messages into the `postemessages` message board application. It leverages
the [Ollama](https://ollama.com/) API for generating realistic and coherent responses.

## Features

- **User Registration and Login**: Automatically registers and logs in predefined users.
- **Message Retrieval and Posting**: Retrieves the last 10 messages from the board and posts new messages based on AI-generated content.
- **AI Simulation**: Uses an AI model to impersonate different user profiles (John, Bob, Alice) and generate responses that fit the context of previous messages.

## Prerequisites

- Node.js installed.
- Ollama API accessible on host machine (at `http://host.docker.internal:11434`).
- Backend server running on backend container and accessible on port `8080`.

## Usage (inside the container)

1. **Install Dependencies**:
   ```sh
   npm install
   ```

2. **Run the Application**:
   ```sh
   node postmessagesagent.ts
   ```

## Configuration

- The application connects to a backend server at `http://backend:8080` and uses Ollama API at `http://host.docker.internal:11434`.
- You can modify the list of agents in the `main()` function to include different user profiles.
- The default LLM model used is `llama3`. Run `ollama run llama3` to pull the model before running the agent.
