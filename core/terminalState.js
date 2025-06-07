// Implementation of the central Terminal State and Command Routing Core to handle mode switching, 
// dynamic prompt display, and processing of all user commands.
window.currentMode = 'cli';
let typingInterval = null;

function getPromptPrefix() {
    return window.currentMode === 'demo' ? 'visitor@demo' : 'visitor@cli';
}

function createDynamicPromptHTML(text) {
    const prefix = getPromptPrefix();
    return '<span class="prompt-prefix-container"><span class="prompt-text-prefix">' + prefix + '</span><span class="prompt-symbol">></span></span><span class="wrapped-output">' + String(text) + '</span>';
}

function safeCreatePromptHTML(text) {
    return '<span class="prompt-prefix-container"><span class="prompt-text-prefix">visitor@cli</span><span class="prompt-symbol">></span></span><span class="wrapped-output">' + String(text) + '</span>';
}