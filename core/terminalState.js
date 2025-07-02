// Implementation of the Command Definitions Module to define terminal commands, manage CLI/demo modes, generate dynamic prompt output and wire frontend demo command to backend API with fetch..

window.currentMode = 'cli';
let typingInterval = null;

// Prompt prefix utilities
// Returns the current prompt prefix based on CLI or Demo mode
function getPromptPrefix() {
    return window.currentMode === 'demo' ? 'visitor@demo' : 'visitor@cli';
}

// Creates a dynamic prompt line for a given text input
function createDynamicPromptHTML(text) {
    const prefix = getPromptPrefix();
    return '<span class="prompt-prefix-container"><span class="prompt-text-prefix">' + prefix + '</span><span class="prompt-symbol">></span></span><span class="wrapped-output">' + String(text) + '</span>';
}

// Creates a safe prompt line always showing CLI prefix
function safeCreatePromptHTML(text) {
    return '<span class="prompt-prefix-container"><span class="prompt-text-prefix">visitor@cli</span><span class="prompt-symbol">></span></span><span class="wrapped-output">' + String(text) + '</span>';
}

// Updates the live prompt prefix in the terminal
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

// Command definitions
window.commands = {
    // Help command showing all available commands
    help: "Available commands:\nabout       View information about the creator.\nprojects    View details of my projects.\nstack       View the technology stack used.\nclear       Clears the terminal history.\nhelp        Displays this list of commands.\ndemo        Run a simple command demo.\nexit        Exit the current mode.", 
    
    // Projects command to list projects or show details
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

        return `Error: Invalid argument '${args}'. Usage:\n  projects\n  projects show "<name>"`;
    },

    // About command describing the project and creator
    about: "<strong class=\"title-strong\">PROJECT TERMINAL</strong>\n\nThis interface showcases Donaven Bruce's backend and service development work.\n\n- Focus: RESTful API design, Java & Spring Boot frameworks.\n\n- Connect: View source code on GitHub or contact via LinkedIn (links available in the sidebar).\n\nFuture Plans:\n\nThe current service will be integrated with a client-side frontend (React/JavaScript) soon.",
    
    // Stack command showing technology stack
    stack: "<strong class=\"title-strong\">Current Stack Breakdown</strong>\n\nProject: **String Puzzles API**\n\n- Language: Java 21\n\n- Framework: Spring Boot 3.x\n\n- Architecture: RESTful Monolith Service\n\n- Status: Stable, Ready for client integration.",
    


    // Clear command clears terminal output
    clear: 'CLEAR',

    // Demo command enters demo mode and lists available demos
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
    },

    // Exit command exits demo mode and returns to CLI
    exit: function() {
        if (window.currentMode === 'demo') {
            window.currentMode = 'cli';
            updateLivePromptPrefix(); 
            return "Exiting Demo Mode. Back to main terminal.";
        }
        return "You aren't currently running a program or in a special mode.";
    },

    // Command processor: parses input and routes to appropriate command
    process: async function(input) {
        const parts = input.trim().toLowerCase().split(' ');
        const cmd = parts[0];
        const args = input.trim().substring(cmd.length).trim(); 

        if (cmd === 'exit') {
            return this.exit();
        }
        
        if (window.currentMode === 'demo') {
            if (cmd === 'demo') {
                return this.demo();
            }

            // Check if the command is our 'string-puzzles' demo
            if(cmd === 'string-puzzles') {
                // Parse the arguments from the 'args' variable
                const parts = args.match(/"(.*?)"/g) || [];
                if(parts.length < 2) {
                    return "Usage: string-puzzles \"<text1>\" \"<text2>\"";
                }

                const text1 = parts[0].replace(/"/g, '');
                const text2 = parts[1].replace(/"/g, '');

                // Create the data payoad
                const data = { text1: text1, text2: text2 };

                // Call the API using fetch()
                try {
                    //use port 8080
                    const response = await fetch('http://localhost:8080/api/string-puzzle', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json'},
                        body: JSON.stringify(data)
                    });

                    if(!response.ok) {
                        return `Error from API: ${response.status} ${response.statusText}`;
                    }

                    // Get and rformat the results
                    const results = await response.json();

                    let output = "<strong class=\"title-strong\">-- String Puzzle Results --</strong>\n";
                    output += `  Text 1: "${text1}"\n`;
                    output += `  Text 2: "${text2}"\n\n`;
                    output += `  Is "${text1}" a palindrome?  **${results.isPalindrome1}**\n`;
                    output += `  Is "${text2}" a palindrome?  **${results.isPalindrome2}**\n`;
                    output += `  Are they anagrams?            **${results.areAnagrams}**\n`;
                    output += `  Is text2 a substring of text1? **${results.isSubString}**`;
                    return output;

                } catch (error) {
                    console.error('Fetch error:', error);
                    return "Error: Could not connect to the API."
                }
            }
            // Check if they typed another demo name that isn't implemented
            else if(cmd in window.demos) {
                return `Demo **${cmd}** is not yet implemented.`;
            }
            // Handle unknown commands in demo mode
            else {
                return `Unknown command **${cmd}**. Type 'demo' to view available programs, or 'exit'.`;
            }
        }

        if (cmd === 'open') {
            return this.open ? this.open(args) : `Command not found: ${cmd}\nType 'help' for available commands.`;
        }
        if (cmd === 'clear') {
            const oc = document.querySelector('.output-container');
            if (oc) oc.innerHTML = '';
            return '';
        }
        
        const result = this[cmd];
        return typeof result === 'function' ? result(args) : result ? result : `Command not found: ${cmd}\nType 'help' for available commands.`;
    }
};