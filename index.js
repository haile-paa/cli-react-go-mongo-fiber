#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { execSync } = require("child_process");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askForProjectName = () => {
  return new Promise((resolve) => {
    rl.question("Enter your project name: ", (projectName) => {
      rl.close();
      resolve(projectName || "my-project"); // Default to "my-project" if no name is provided
    });
  });
};

const createFolderStructure = (projectPath) => {
  console.log("Creating project folder structure...");

  const folders = [
    `${projectPath}/backend/config`,
    `${projectPath}/backend/controllers`,
    `${projectPath}/backend/models`,
    `${projectPath}/backend/routes`,
    `${projectPath}/frontend/src`,
    `${projectPath}/frontend/public`,
    `${projectPath}/shared/utils`,
  ];

  folders.forEach((folder) => {
    fs.mkdirSync(folder, { recursive: true });
  });

  console.log("Folder structure created successfully!");
};

const initBackend = (projectPath) => {
  console.log("Initializing backend...");
  const backendPath = `${projectPath}/backend`;

  // Initialize Go module and install dependencies
  execSync(
    `cd ${backendPath} && go mod init backend && go get github.com/gofiber/fiber/v2 go.mongodb.org/mongo-driver`,
    {
      stdio: "inherit",
    }
  );

  fs.writeFileSync(
    `${backendPath}/main.go`,
    `package main

import (
    "github.com/gofiber/fiber/v2"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
    app := fiber.New()

    // MongoDB connection setup
    client, err := mongo.Connect(nil, options.Client().ApplyURI("mongodb://localhost:27017"))
    if err != nil {
        panic(err)
    }

    // Example route
    app.Get("/", func(c *fiber.Ctx) error {
        return c.SendString("Hello, World!")
    })

    app.Listen(":4000")
}
    `
  );

  console.log("Backend initialized and dependencies installed successfully!");
};

const initFrontend = (projectPath) => {
  console.log("Initializing frontend...");
  const frontendPath = `${projectPath}/frontend`;

  // Initialize package.json and install dependencies using npm
  execSync(
    `cd ${frontendPath} && npm init -y && npm install react react-dom vite tailwindcss`,
    { stdio: "inherit" }
  );

  // Create Tailwind CSS configuration
  execSync(`cd ${frontendPath} && npx tailwindcss init`, { stdio: "inherit" });

  // Create default files
  fs.writeFileSync(
    `${frontendPath}/src/App.jsx`,
    `import React from "react";

const App = () => {
    return <div className="text-center text-3xl font-bold">Welcome to Your Project!</div>;
};

export default App;
    `
  );

  fs.writeFileSync(
    `${frontendPath}/src/index.css`,
    `@tailwind base;
@tailwind components;
@tailwind utilities;
    `
  );

  fs.writeFileSync(
    `${frontendPath}/src/main.jsx`,
    `import { StrictMode } from 'react'; 
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
    `
  );

  fs.writeFileSync(
    `${frontendPath}/tailwind.config.js`,
    `module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
};
    `
  );

  console.log("Frontend initialized successfully!");
};

const main = async () => {
  const projectName = await askForProjectName(); // Prompt for the project name
  const projectPath = path.join(process.cwd(), projectName);

  console.log(`Creating project: ${projectName}`);
  fs.mkdirSync(projectPath, { recursive: true });

  createFolderStructure(projectPath);
  initBackend(projectPath);
  initFrontend(projectPath);

  console.log("Project setup complete!");

  // Display instructions for running the project
  console.log(`
To start the project, follow these steps:
1. Navigate to the project folder:
   cd ${projectName}
   
2. Navigate to the frontend folder:
   cd frontend

3. Install the frontend dependencies (if not already installed):
   npm install

4. Run the development server:
   npm run dev
`);
};

main();
