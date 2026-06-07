# MERN Azure Todo App

A simple MERN stack sample app with Node.js/Express backend connected to MongoDB and a React frontend. This project is designed to deploy to Microsoft Azure App Service with a MongoDB connection string configured in environment settings.

## Features

- MongoDB with Mongoose for data storage
- Express API for CRUD operations
- React frontend for listing, adding, toggling, and deleting todos
- Production build served by the Express server

## Setup

1. Copy `.env.example` to `.env` in the root folder.
2. Set `MONGODB_URI` to your MongoDB connection string.
3. Set `REACT_APP_API_URL` for the frontend API endpoint:
   - Leave it empty (or remove it) for local development with proxy (default)
   - Set to `http://localhost:3001` for React dev server without proxy
   - Set to your Azure app URL for production (e.g., `https://your-app.azurewebsites.net`)

Example for local development with proxy:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mern-azure-sample?retryWrites=true&w=majority
PORT=3001
REACT_APP_API_URL=
```

Example for production on Azure:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mern-azure-sample?retryWrites=true&w=majority
PORT=3001
REACT_APP_API_URL=https://your-app.azurewebsites.net
```

4. Install dependencies and start the app:

```bash
npm install
npm start
```

4. Open `http://localhost:3001`.

## Azure Deployment

Use Azure App Service with Node.js. Set App Settings for `MONGODB_URI` and optionally `REACT_APP_API_URL` (leave empty if serving React from Express).

### Azure CLI example

```bash
az login
az group create --name mern-rg --location "East US"
az appservice plan create --name mern-plan --resource-group mern-rg --sku B1 --is-linux
az webapp create --resource-group mern-rg --plan mern-plan --name <YOUR_APP_NAME> --runtime "NODE|18-lts"
az webapp config appsettings set --resource-group mern-rg --name <YOUR_APP_NAME> --settings MONGODB_URI="<your-connection-string>" REACT_APP_API_URL="https://<YOUR_APP_NAME>.azurewebsites.net"
az webapp deploy --resource-group mern-rg --name <YOUR_APP_NAME> --src-path .
```

## Notes

- The root `postinstall` script will build the React frontend when Azure installs packages.
- The Express server serves the React production build from `frontend/build`.
- For local development, use `npm run dev` after installing dependencies.
- The `REACT_APP_API_URL` environment variable controls the frontend API endpoint. Leave it empty for proxy mode or set it to your Azure app URL for production.
- Create a `.env` file in the root and a `.env` file in `frontend/` based on the `.env.example` files.
