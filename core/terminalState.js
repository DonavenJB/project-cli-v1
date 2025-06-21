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

function updateLivePromptPrefix() {
    const promptPrefixElements = document.querySelectorAll('.prompt-text-prefix');
    const promptSymbolElement = document.querySelector('.prompt-symbol');
    
    if (promptPrefixElements.length > 0) {
        const livePromptElement = promptPrefixElements[promptPrefixElements.length - 1];
        livePromptElement.textContent = getPromptPrefix();  
    }
    if (promptSymbolElement) {
        promptSymbolElement.textContent = '>';
    }
}

window.commands = {
    help: "Available commands:\nabout       View information about the creator.\nprojects    View details of my projects.\nstack       View the technology stack used.\nclear       Clears the terminal history.\nhelp        Displays this list of commands.\ndemo        Run a simple command demo.\nexit        Exit the current mode.", 
    projects: function(args) {
        const parts = args.trim().toLowerCase().split(' ');
        const subcommand = parts[0];
        const projectName = parts.slice(1).join(' ').replace(/"/g, '').trim(); 

        if (subcommand === 'show' && projectName) {
            return formatProjectDetail(projectName, window.projectData);
        }
        
        if (!args || args.trim() === '' || subcommand === 'list') {
             return formatProjectSummary(window.projectData);
        }

        return `Error: Invalid argument '${args}'. Usage:\n  projects\n  projects show "<name>"`;
    },
    about: "<strong class=\"title-strong\">PROJECT TERMINAL</strong>\n\nThis interface showcases Donaven Bruce's backend and service development work.\n\n- Focus: RESTful API design, Java & Spring Boot frameworks.\n\n- Connect: View source code on GitHub or contact via LinkedIn (links available in the sidebar).\n\nFuture Plans:\n\nThe current service will be integrated with a client-side frontend (React/JavaScript) soon.",
    stack: "<strong class=\"title-strong\">Current Stack Breakdown</strong>\n\nProject: **String Puzzles API**\n\n- Language: Java 21\n\n- Framework: Spring Boot 3.x\n\n- Architecture: RESTful Monolith Service\n\n- Status: Stable, Ready for client integration.",
    clear: 'CLEAR',

demo: function() {
        if (window.currentMode === 'demo') {
        	 return "Already in Demo Mode. Type 'exit' to return to the main terminal.";
        }
        window.currentMode = 'demo';
        updateLivePromptPrefix(); 
        
        let output = "Entering Demo Mode.\nType the program name below to run a demo, or <strong class=\"title-strong\">exit</strong>.\n\n"; 
        output += "<strong class=\"title-strong\">Available Demos:</strong>\n";
        
        for (const cmd in window.demos) {
        	 const paddedCmd = cmd.padEnd(17);
        	 output += `\n**${paddedCmd}** ${window.demos[cmd]}`;
        }
        output += "\n";
        
        return output;
    }
};