// Implementation of the Utility Module for converting plain text to formatted HTML output 
// and structuring complex data displays (project tables/details).

function formatOutputForHTML(text) {
    if (typeof text !== 'string') {
        return text;
    }
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

function formatProjectSummary(data) {
    if (data.length === 0) {
        return "No projects found in the system.";
    }

    const header = "<strong class=\"title-strong\">PROJECTS</strong>\n" + "Name".padEnd(29) + " | " + "Status".padEnd(25) + " | Endpoint\n" + "-".repeat(75);
    let output = header;

    data.forEach(p => {
        const activePrefix = p.isActive ? '* ' : '  ';
        const name = (activePrefix + `**${p.name}**`).padEnd(25 + 8); 
    	  const status = p.status.padEnd(25);
    	  const endpoint = p.endpoint;

    	  output += `\n${name} | ${status} | ${endpoint}`;
    });
    
    output += "\n\nTip: Use 'projects show \"<name>\"' for full details.";

    return output;
}