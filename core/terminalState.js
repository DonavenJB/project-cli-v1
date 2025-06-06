// Implementation of the central Terminal State and Command Routing Core to handle mode switching, 
// dynamic prompt display, and processing of all user commands.
window.currentMode = 'cli';
let typingInterval = null;

function getPromptPrefix() {
    return window.currentMode === 'demo' ? 'visitor@demo' : 'visitor@cli';
}