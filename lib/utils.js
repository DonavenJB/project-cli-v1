// Implementation of the Utility Module for converting plain text to formatted HTML output 
// and structuring complex data displays (project tables/details).

function formatOutputForHTML(text) {
    if (typeof text !== 'string') {
        return text;
    }
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}