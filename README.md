# Project Terminal Interface

The Project Terminal Interface is a modular, client-side command-line environment designed to present backend development work in a structured and professional format. It provides a clean command structure, clear separation of logic, and an extendable architecture suitable for showcasing technical projects.

This interface operates entirely within the browser, simulating a command-line workflow while remaining lightweight, organized, and easy to maintain.

---

## Overview

Users interact with a terminal-style prompt and can enter commands to explore project information, view active technologies, and access demonstration modules. The system is intentionally minimal by default while supporting structured expansion.

---

## Usage

The following commands are available for interaction within the terminal environment:

| Command | Description |
|--------|-------------|
| `projects` | Displays a compact list of all available projects. |
| `projects show "<name>"` | Displays full project specifications for a selected project. |
| `about` | Shows information about the project creator and the purpose of the interface. |
| `stack` | Lists the key technologies used by the currently active project. |
| `demo` | Enters demonstration mode and provides access to available program demos. |
| `help` | Lists available commands with brief descriptions. |

This design ensures that users see only essential information by default and can request detailed information when needed.

---

## Project Structure

The application follows a clear separation of concerns, divided into distinct directories based on function and responsibility.

### core/
Contains `terminalState.js`, responsible for:
- Global runtime state, including `currentMode`
- Command routing and parsing logic
- Ensuring each command delegates correctly to rendering and data utilities

### data/
Contains `projectData.js`, which stores:
- All project descriptions and metadata
- Demo definitions used by the terminal

This directory is dedicated solely to structured data.

### lib/
Contains `utils.js`, which provides:
- Formatters for project summaries and detailed project output
- Safe matching and validation utilities
- Functions that produce text output without interacting with the DOM

These functions ensure consistent, predictable formatting.

### ux/
Contains `domHandlers.js`, which manages:
- Typing effects and terminal text output
- Input event handling
- Terminal initialization on page load

All browser interactions and display logic are handled here.

---

## Development Notes

The interface is built using standard JavaScript, HTML, and CSS.  
It is fully client-side but structured to support future integration with backend services, including RESTful API endpoints and server-side data retrieval.

The modular directory structure allows each part of the system—data, utilities, state logic, and user interface—to be expanded independently without interfering with the others.

---

## License

This project is released under the MIT License and may be modified or extended for personal or commercial use.

---

## Next Steps

- Implement the command handlers in `core/terminalState.js`
- Add additional project definitions in `data/projectData.js`
- Refine formatting logic within `lib/utils.js`
- Expand interface functionality through additions in `ux/domHandlers.js`

This provides a solid foundation for a clean, organized, and extensible project terminal environment.
