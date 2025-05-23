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
});