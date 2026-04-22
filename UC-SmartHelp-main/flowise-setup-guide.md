# Flowise Setup Guide

## Quick Setup Instructions

### 1. Install Flowise
```bash
npm install -g @flowiseai/flowise
```

### 2. Create Flowise Directory
```bash
mkdir flowise
cd flowise
```

### 3. Create .env File
Create a `.env` file in the flowise directory:

```env
# Database Configuration
FLOWISE_DB_TYPE=sqlite
FLOWISE_DB_PATH=./flowise.db

# Server Configuration
FLOWISE_PORT=3001
FLOWISE_HOST=localhost

# CORS Configuration
FLOWISE_CORS_ORIGIN=http://localhost:8080

# Optional Authentication
FLOWISE_ENABLE_AUTH=false
```

### 4. Start Flowise
```bash
flowise start
```

### 5. Access Flowise UI
Open your browser and go to: http://localhost:3001

### 6. Create a Chatbot Workflow
1. In Flowise UI, create a new workflow
2. Add a "Chat Input" node
3. Add an LLM node (OpenAI, etc.)
4. Add a "Chat Output" node
5. Connect them together
6. Save and deploy the workflow

### 7. Get the Workflow ID
After deploying, note the workflow ID from the URL or API endpoint.

### 8. Update Your Frontend
Update your FlowiseChatbot component to use the correct Flowise server URL and workflow ID.

## Troubleshooting

### Common Issues:

1. **Port 3001 already in use**: Change FLOWISE_PORT in .env
2. **Database permissions**: Ensure the flowise directory is writable
3. **CORS errors**: Make sure FLOWISE_CORS_ORIGIN matches your frontend URL
4. **LLM API keys**: Configure your LLM provider API keys in Flowise settings

### Testing Flowise
```bash
# Test if Flowise is running
curl http://localhost:3001/api/v1/ping

# Should return: {"status":"ok"}
```

## Integration with Your Project

Your chatbot is already set up to work with Flowise. The FlowiseChatbot component in your project should automatically connect to Flowise running on port 3001.

If you need to change the Flowise server URL, update the `FLOWISE_SERVER_URL` constant in your FlowiseChatbot component.