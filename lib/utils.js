// Implementation of the Utility Module for converting plain text to formatted HTML output 
// and structuring complex data displays (project tables/details).

// Converts Markdown-style bold syntax (**) to HTML <strong> tags
function formatOutputForHTML(text) {
    if (typeof text !== 'string') {
        return text;
    }
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

// Formats a summary table of all projects for terminal display
function formatProjectSummary(data) {
    if (data.length === 0) {
        return "No projects found in the system.";
    }

    const header = "<strong class=\"title-strong\">PROJECTS</strong>\n" + "Name".padEnd(29) + " | " + "Status".padEnd(25) + " | Endpoint\n" + "-".repeat(75);
    let output = header;

    // Iterate through each project and add a row with name, status, and endpoint
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

// Formats detailed information for a single project by name
function formatProjectDetail(name, data) {
    const searchName = name.toLowerCase().trim();
    
    const project = data.find(p => p.name.toLowerCase() === searchName);

    if (!project) {
    	  return `Error: Project '${name}' not found.\nRun 'projects' to see available projects.`;
    }

    // Construct detailed output including status, endpoint, objective, architecture, and notes
    let output = `<strong class=\"title-strong\">Project Details:</strong> **${project.name}**\n\n`;
  	  output += `- Status: ${project.status}\n`;
  	  output += `- Active: ${project.isActive ? 'Yes' : 'No'}\n`;
      output += `- Endpoint: ${project.endpoint}\n`;
  	  output += `- Objective: ${project.objective}\n`;
  	  output += `- Architecture: ${project.architecture}\n`;
  	  output += `- Further Details: ${project.further_details}\n`;

  	  return output;
}