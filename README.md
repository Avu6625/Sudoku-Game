# Sudoku-Game
Interactive Sudoku engine built with Vanilla JS. Features a recursive backtracking algorithm for dynamic grid generation across three difficulty tiers. Focused on high-performance DOM manipulation and custom state management without external libraries. Includes dark mode, real-time error checking, and a smart hint system.

# Sudoku JS

A sleek, responsive Sudoku puzzle game built with Vanilla JavaScript. Features include dynamic puzzle generation, difficulty scaling, and a built-in dark mode.

## Features

- Dynamic Generation: New, valid puzzles are generated for every game session.
- Difficulty Modes: Choose between Easy, Medium, and Hard.
- Interactive Board: 
  - Number highlighting (highlights all instances of a selected digit).
  - Error tracking and visual feedback.
  - Hint system (limited to 6 per game).
- Game Management: Timer, pause/resume functionality, and game state persistence.
- Modern UI: Responsive design with a togglable Dark Mode.

## Built With

- HTML5: Semantic structure for game controls and board layout.
- CSS3: Utilizes CSS Grid for the 9x9 board and CSS Variables for the theme engine.
- JavaScript (ES6+): 
  - Recursive backtracking algorithm for puzzle generation.
  - DOM API for real-time board rendering.
  - Event-driven logic for game controls.

## How to Play

1. Start: Select your difficulty and click "Start Game."
2. Input: Click a number from the digit selector at the bottom, then click a cell on the board to place it.
3. Rules: Classic Sudoku rules apply—fill the grid so that every row, column, and 3x3 box contains the digits 1 through 9.
4. Tools: Use the "Hint" button if you get stuck, or toggle the 🌙 icon for late-night sessions.

