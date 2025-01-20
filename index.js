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
  execSync(`cd ${backendPath} && go mod init backend `, {
    stdio: "inherit",
  });

  fs.writeFileSync(
    `${backendPath}/main.go`,
    `package main

import (
    "github.com/gofiber/fiber/v2"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
    "log"
)

func main() {
    app := fiber.New()

    // MongoDB connection setup
    client, err := mongo.Connect(nil, options.Client().ApplyURI("mongodb://localhost:27017"))
    if err != nil {
        panic(err)
    }

    // Ensure the connection is established
    err = client.Ping(nil, nil)
    if err != nil {
        panic(err)
    }

    log.Println("MongoDB connection established successfully")

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

  // Overwrite package.json with the desired structure
  const frontendPackageJson = {
    name: "frontend",
    version: "1.0.0",
    main: "src/main.jsx",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    keywords: [],
    author: "",
    license: "ISC",
    description: "",
    dependencies: {
      react: "^19.0.0",
      "react-dom": "^19.0.0",
      tailwindcss: "^3.4.17",
      vite: "^6.0.7",
    },
  };

  fs.writeFileSync(
    `${frontendPath}/package.json`,
    JSON.stringify(frontendPackageJson, null, 2) // Format with 2 spaces
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
    `import React from 'react'; 
import { StrictMode } from 'react'; 
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

  // Create index.html file
  fs.writeFileSync(
    `${frontendPath}/index.html`,
    `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PA App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
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

3. Run the development server:
   npm run dev

For the backend server:

1. Navigate to the project folder:
   cd ${projectName}

2. Navigate to the backend folder:
   cd backend

3. Run the following commands to set up and start the Go server:

   a. Clean up the Go module dependencies:
      go mod tidy

   b. Start the Go server:
      go run main.go

`);
};

main();
