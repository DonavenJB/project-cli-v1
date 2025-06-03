function typeWriter(text, targetElement, speed = 25) {
    let i = 0;
    const liveInput = document.querySelector('.command-input');
    if (!liveInput) return;
    const originalPlaceholder = liveInput.placeholder || '';
    function type() {
        if (i < text.length) {
      	 	 liveInput.setAttribute('placeholder', liveInput.getAttribute('placeholder') + text.charAt(i));
      	 	 i++;
      	 	 typingInterval = setTimeout(type, speed);
      	 } else {
      	 	 clearTimeout(typingInterval);
      	 	 const outputContainer = document.querySelector('.output-container');
      	 	 const terminal = document.querySelector('.terminal-content');
      	 	 const finalTypedText = liveInput.getAttribute('placeholder') || '';
      	 	 liveInput.setAttribute('placeholder', originalPlaceholder);
      	 	 const finalPromptEcho = document.createElement('div');
      	 	 finalPromptEcho.className = 'prompt echo-line';
      	 	 finalPromptEcho.innerHTML = safeCreatePromptHTML(finalTypedText); 
      	 	 outputContainer.appendChild(finalPromptEcho);
      	 	 liveInput.style.display = 'block';
      	 	 if (terminal) terminal.scrollTop = terminal.scrollHeight;
      	 }
    }
    liveInput.style.display = 'block';
    liveInput.setAttribute('placeholder', '');
    type();
}

document.addEventListener('DOMContentLoaded', function() {
    const input = document.querySelector('.command-input');
    const output = document.querySelector('.output-container');
    const terminal = document.querySelector('.terminal-content');
    const promptContainer = document.querySelector('.prompt');
    const promptSymbol = document.querySelector('.prompt-symbol');
    
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
    window.originalKeydownHandler = function(e) {
    	  if (e.key === 'Enter') {
    	 	 const cmd = this.value.trim();
    	 	 if (cmd) {
    	 	 	 const promptLine = document.createElement('div');
    	 	 	 promptLine.className = 'prompt echo-line';
    	 	 	 
    	 	 	 promptLine.innerHTML = createDynamicPromptHTML(cmd); 
    	 	 	 output.appendChild(promptLine);
    	 	 	 
    	 	 	 const result = window.commands.process(cmd);
  	 	 	 	 if (result) {
  	 	 	 	 	 const outputLine = document.createElement('div');
  	 	 	 	 	 outputLine.className = 'output';
  	 	 	 	 	 if (result instanceof HTMLElement) {
  	 	 	 	 	 	 outputLine.appendChild(result);
  	 	 	 	 	 } else {
  	 	 	 	 	 	 outputLine.innerHTML = formatOutputForHTML(result);
  	 	 	 	 	 }
  	 	 	 	 	 output.appendChild(outputLine);
  	 	 	 	 }
  	 	 	 	 this.value = '';
    	 	 	 	 scrollToBottom();
    	 	 	 }
    	 	 }
    };
    if (input) input.addEventListener('keydown', window.originalKeydownHandler);
    
    const inputElement = document.querySelector('.command-input');
    const outputContainer = document.querySelector('.output-container');
  	  let commandHistory = [];
  	  let historyIndex = -1;
  	  
  	  const welcomeText = "Welcome to the Project Terminal. Type 'about' or 'help'."; 
  	  const liveInputPrompt = document.querySelector('.command-input');
  	  
  	  function startTypewriterWelcome() {
  	 	 if (!liveInputPrompt) return;
    	 liveInputPrompt.style.display = 'none';
  	 	 
  	 	 let typingIndex = 0;
  	 	 const typingSpeed = 25;
  	 	 
  	 	 function type() {
  	 	 	 if (typingIndex < welcomeText.length) {
  	 	 	 	 liveInputPrompt.setAttribute('placeholder', (liveInputPrompt.getAttribute('placeholder') || '') + welcomeText.charAt(typingIndex));
  	 	 	 	 typingIndex++;
  	 	 	 	 typingInterval = setTimeout(type, typingSpeed);
  	 	 	 } else {
  	 	 	 	 clearTimeout(typingInterval);
  	 	 	 	 const finalPromptEcho = document.createElement('div');
  	 	 	 	 finalPromptEcho.className = 'prompt echo-line';
  	 	 	 	 finalPromptEcho.innerHTML = safeCreatePromptHTML(welcomeText); 
  	 	 	 	 outputContainer.appendChild(finalPromptEcho);
  	 	 	 	 liveInputPrompt.setAttribute('placeholder', "Type 'help' for available commands");
  	 	 	 	 liveInputPrompt.style.display = 'block';
  	 	 	 	 if (terminal) terminal.scrollTop = terminal.scrollHeight;
  	 	 	 }
  	 	 }
  	 	 liveInputPrompt.style.display = 'block';
  	 	 liveInputPrompt.setAttribute('placeholder', '');
  	 	 type();
  	 }
  	 
  	 if (inputElement) {
  	 	 inputElement.addEventListener('keydown', async function(e) {
  	 	 	 if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
  	 	 	 	 e.preventDefault();
  	 	 	 	 if (commandHistory.length === 0 || typingInterval) return;
  	 	 	 	 if (e.key === 'ArrowUp') historyIndex = Math.min(historyIndex + 1, commandHistory.length - 1); else historyIndex = Math.max(historyIndex - 1, -1);
  	 	 	 	 this.value = historyIndex === -1 ? '' : commandHistory[historyIndex];
  	 	 	 }
  	 	 	 if (e.key === 'Enter') {
  	 	 	 	 if (typingInterval) return;
  	 	 	 	 const val = this.value.trim(); 
  	 	 	 	 this.value = '';
  	 	 	 	 if (val) {
  	 	 	 	 	 commandHistory.unshift(val);
  	 	 	 	 	 historyIndex = -1;
  	 	 	 	 	 
  	 	 	 	 	 const result = window.commands.process(val);
  	 	 	 	 	 
  	 	 	 	 	 if (result !== undefined && result !== null && result !== '') { 
  	 	 	 	 	 	 
  	 	 	 	 	 	 const commandEcho = document.createElement('div');
  	 	 	 	 	 	 commandEcho.className = 'prompt echo-line';
  	 	 	 	 	 	 commandEcho.innerHTML = createDynamicPromptHTML(val); 
  	 	 	 	 	 	 outputContainer.appendChild(commandEcho);
  	 	 	 	 	 	 
  	 	 	 	 	 	 if (result === 'CLEAR') { 
  	 	 	 	 	 	 	 outputContainer.innerHTML = '';
  	 	 	 	 	 	 } else {
  	 	 	 	 	 	 	 const outputLine = document.createElement('div');
  	 	 	 	 	 	 	 outputLine.className = 'output';
  	 	 	 	 	 	 	 
  	 	 	 	 	 	 	 outputLine.innerHTML = formatOutputForHTML(result);
  	 	 	 	 	 	 	 outputContainer.appendChild(outputLine);
  	 	 	 	 	 	 }
  	 	 	 	 	 	 
  	 	 	 	 	 	 scrollToBottom();
    	 	 	 	 	 	 
  	 	 	 	 	 } else if (result === '') {
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
  	 	 liveInputPrompt.style.display = 'none';
  	 	 startTypewriterWelcome();
  	 }
  	 if (inputElement) {
  	 	 inputElement.addEventListener('focus', () => {
  	 	 	 if (window.innerWidth < 768) inputElement.scrollIntoView({behavior: 'smooth', block: 'center'});
  	 	 });
  	 }
});