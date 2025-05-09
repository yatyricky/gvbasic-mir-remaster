# Canvas Game

## Overview
This project is a single-page game built using pure JavaScript and the HTML5 Canvas API. It utilizes Vite as a build tool for a fast development experience.

## Project Structure
```
canvas-game
├── src
│   ├── js
│   │   ├── game.js        # Main game loop and logic
│   │   ├── canvas.js      # Canvas setup and drawing functions
│   │   ├── input.js       # User input management
│   │   └── utils.js       # Utility functions
│   ├── assets
│   │   ├── audio          # Directory for audio files
│   │   │   └── .gitkeep   # Keep the audio directory in version control
│   │   └── sprites        # Directory for sprite images
│   │       └── .gitkeep   # Keep the sprites directory in version control
│   ├── styles
│   │   └── main.css       # Styles for the game
│   └── index.html         # Main HTML file
├── public
│   └── favicon.svg        # Favicon for the game
├── package.json           # npm configuration file
├── vite.config.js         # Vite configuration file
├── .gitignore             # Git ignore file
└── README.md              # Project documentation
```

## Setup Instructions
1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd canvas-game
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the development server**:
   ```
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:3000` to see the game in action.

## Game Details
- The game is designed to be simple and engaging, utilizing classic game mechanics.
- Players can control the game using keyboard and mouse inputs.
- The game features a variety of sprites and audio assets to enhance the experience.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.