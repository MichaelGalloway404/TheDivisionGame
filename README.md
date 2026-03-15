# The Division Game

**The Division Game** is a browser-based puzzle game built with **JavaScript, HTML, and CSS** that demonstrates grid-based game logic, custom mathematical rules, and interactive UI state management.

Play the game:  
https://michaelgalloway404.github.io/TheDivisionGame/

## Overview

The game takes place on a **5×5 grid of numbers** where the player controls a movable tile. When the player moves to an adjacent tile, the value in that tile is divided by the player's value using a **custom division rule** designed to keep all values within a playable integer range.

The goal is to **reduce the board to as many zero values as possible while minimizing the final remaining numbers**. When the player submits the board, the remaining values are summed to produce a **final penalty score**.

## Key Features

- **Custom mathematical rule system** that transforms division results into playable integers.
- **Grid-based movement system** (up, down, left, right).
- **Randomized board generation** for unique puzzles each playthrough.
- **Undo system** using saved board states.
- **Interactive UI** with dynamic DOM updates and visual highlighting of the player position.

## Technical Highlights

- Board state managed as a **2D array**
- **Move history stack** for undo functionality
- **Random puzzle generation**
- **Event-driven UI** using JavaScript DOM event listeners
- Dynamic rendering of the board and player state

## Technologies Used

- JavaScript
- HTML
- CSS

## Author

Michael Galloway  
