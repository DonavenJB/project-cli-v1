// Implementation of the Data Module to define the list of available projects, 
// their details, and the demo programs for the application's content.

// Demo programs available for the terminal interface
window.demos = {
    "string-puzzles": "String Puzzles API: Tests for Anagrams, Palindromes, and Substrings.",
};

// Project data array containing detailed information for each project
window.projectData = [
    {
        // Project name and active status
        name: "String Puzzles API",
        status: "Online and Functional",
        endpoint: "POST /api/string-puzzle",
        objective: "Demonstrate Java and Spring Boot proficiency in building a RESTful backend service.",
        architecture: "Modular, Service Monolith",
        further_details: "Currently being integrated with a client-side frontend (React/JavaScript) soon.",
        isActive: true
    },
    {
        // CLI Terminal UI project details
        name: "CLI Terminal UI",
        status: "Maintenance Mode",
        endpoint: "N/A (Frontend Only)",
        objective: "Create an interactive portfolio interface using pure JavaScript and CSS for a classic terminal feel.",
        architecture: "Monolithic Frontend (JS)",
        further_details: "Features command parsing, history, and multi-mode switching (CLI/Demo).",
        isActive: false
    }
];