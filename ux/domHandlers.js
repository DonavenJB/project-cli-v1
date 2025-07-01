// Implementation of the Terminal UX Module to manage input/output elements, handle user command input, animate the welcome typewriter, maintain command history, and control terminal focus and navigation.

document.addEventListener('DOMContentLoaded', function() {
    const input = document.querySelector('.command-input');
    const output = document.querySelector('.output-container');
    const terminal = document.querySelector('.terminal-content');
    const promptContainer = document.querySelector('.prompt');
    const promptSymbol = document.querySelector('.prompt-symbol');
    
    // Wire up terminal UI: prompt, input handlers, history, and startup welcome typing
    // Initial prompt setup
    if (promptContainer && promptSymbol) {
        const prefixSpan = document.createElement('span');
        prefixSpan.className = 'prompt-text-prefix';
        prefixSpan.textContent = 'visitor@cli'; 
        promptContainer.insertBefore(prefixSpan, promptSymbol);
        
        promptSymbol.textContent = '>';
    }
    
    function scrollToBottom() {
        if (terminal) terminal.scrollTop = terminal.scrollHeight;
    }
    const inputElement = document.querySelector('.command-input');
    const outputContainer = document.querySelector('.output-container');

    // Initialize command history tracking
    let commandHistory = [];
    let historyIndex = -1;
    
    // Welcome message to display with typewriter effect
    const welcomeText = "Welcome to the Project Terminal. Type 'about' or 'help'."; 
    const liveInputPrompt = document.querySelector('.command-input');
    
    function startTypewriterWelcome() {
        // Guard clause: exit if input element is not present
        if (!liveInputPrompt) return;
        // Hide input while welcome text types out
        liveInputPrompt.style.display = 'none';
        
        let typingIndex = 0;
        const typingSpeed = 25;
        
        function type() {
            if (typingIndex < welcomeText.length) {
                // Append the next character to the placeholder and schedule next tick
                liveInputPrompt.setAttribute('placeholder', (liveInputPrompt.getAttribute('placeholder') || '') + welcomeText.charAt(typingIndex));
                typingIndex++;
                typingInterval = setTimeout(type, typingSpeed);
            } else {
                clearTimeout(typingInterval);
                typingInterval = null;
                // Echo the final welcome message in the terminal
                const finalPromptEcho = document.createElement('div');
                finalPromptEcho.className = 'prompt echo-line';
                finalPromptEcho.innerHTML = safeCreatePromptHTML(welcomeText); 
                outputContainer.appendChild(finalPromptEcho);
                // Restore input placeholder and make input visible again
                liveInputPrompt.setAttribute('placeholder', "Type 'help' for available commands");
                liveInputPrompt.style.display = 'block';
                if (terminal) terminal.scrollTop = terminal.scrollHeight;
            }
        }
        // Show input and reset placeholder before typing
        liveInputPrompt.style.display = 'block';
        liveInputPrompt.setAttribute('placeholder', '');
        type();
    }
    
    if (inputElement) {
        inputElement.addEventListener('keydown', async function(e) {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
                // Prevent arrow-key history navigation while the typewriter animation is running
                if (commandHistory.length === 0 || typingInterval) return;
                if (e.key === 'ArrowUp') historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1); else historyIndex = Math.max(historyIndex - 1, -1);
                this.value = historyIndex === -1 ? '' : commandHistory[historyIndex];
            }
            if (e.key === 'Enter') {
                // Prevent input if the typewriter animation is still running
                if (typingInterval) return;

                // Get the trimmed value from the input and reset the input field
                const val = this.value.trim(); 
                this.value = '';
                if (val) {
                    // Add command to history and reset history navigation index
                    commandHistory.unshift(val);
                    historyIndex = -1;
                    
                    // Process the command using the global commands object
                    const result = await window.commands.process(val);
                    
                    if (result !== undefined && result !== null && result !== '') { 
                        
                        // Display the command as a read-only echo in the terminal
                        const commandEcho = document.createElement('div');
                        commandEcho.className = 'prompt echo-line';
                        commandEcho.innerHTML = createDynamicPromptHTML(val); 
                        outputContainer.appendChild(commandEcho);
                        
                        if (result === 'CLEAR') { 

                            // Clear the terminal output
                            outputContainer.innerHTML = '';
                        } else {

                            // Display command output in the terminal
                            const outputLine = document.createElement('div');
                            outputLine.className = 'output';
                            
                            outputLine.innerHTML = formatOutputForHTML(result);
                            outputContainer.appendChild(outputLine);
                        }
                        
                        // Scroll terminal to show latest output
                        scrollToBottom();
                        
                    } else if (result === '') {

                        // Special handling for empty results (e.g., clear command)
                        if (val.toLowerCase() === 'clear') {
                            const commandEcho = document.createElement('div');
                            commandEcho.className = 'prompt echo-line';
                            commandEcho.innerHTML = createDynamicPromptHTML(val); 
                            outputContainer.innerHTML = ''; 
                            outputContainer.appendChild(commandEcho); 
                        }
                        scrollToBottom();
                    }
                }
            }
        });
    }
    if (liveInputPrompt) {
         // Hide input temporarily and start the welcome typewriter animation
        liveInputPrompt.style.display = 'none';
        startTypewriterWelcome();
    }
    if (inputElement) {
        // Ensure input scrolls into view on small screens when focused
        inputElement.addEventListener('focus', () => {
            if (window.innerWidth < 768) inputElement.scrollIntoView({behavior: 'smooth', block: 'center'});
        });
    }
    const mainElement = document.querySelector('.terminal-main');
    // Focus main terminal shortly after DOM ready
    setTimeout(() => { if (mainElement) mainElement.focus(); }, 100);
    const sidebarElement = document.querySelector('.terminal-sidebar');
    // Handle left/right arrow keys to switch focus between sidebar and main terminal
    document.addEventListener('keydown', (e) => {
        if (document.activeElement === inputElement) return; // skip if input is active
        switch (e.key) {
            case 'ArrowLeft': if (sidebarElement) sidebarElement.focus(); break;
            case 'ArrowRight': if (mainElement) mainElement.focus(); break;
        }
    });

    // Make sidebar and main terminal focusable via tab
    if (sidebarElement) sidebarElement.setAttribute('tabindex', '0');
    if (mainElement) mainElement.setAttribute('tabindex', '0');
    // Inform developer/user about arrow key navigation tip
    console.log("Tip: Click outside the input or press Tab to unfocus it, then press arrow keys.");
});