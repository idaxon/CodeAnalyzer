// Initialize AOS animations
AOS.init({
    duration: 1000,
});

// Function to update the code preview dynamically as the user types
function updateCodePreview() {
    const codeInput = document.getElementById('code-input').value;
    const previewDiv = document.getElementById('code-preview');
    previewDiv.textContent = codeInput;
}

function analyzeCode() {
    const code = document.getElementById('code-input').value;
    const resultDiv = document.getElementById('analysis-results');
    const canvas = document.getElementById('performanceGraph');
    const analyzeButton = document.getElementById('analyze-button');

    // Hide the graph
    canvas.style.display = 'none';

    // Show the analysis results section
    resultDiv.style.display = 'block';

    // Clear previous results
    resultDiv.innerHTML = "";

    // Send the code to the backend for analysis
    fetch('http://127.0.0.1:5000/run_code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
        } else {
            resultDiv.innerHTML = `
                <h3>Code Analysis Results</h3>
                <p><strong>Execution Output:</strong><pre>${data.output}</pre></p>
                <p><strong>Execution Time:</strong> ${data.execution_time.toFixed(4)} seconds</p>
                <p><strong>CPU Time:</strong> ${data.cpu_time.toFixed(4)} seconds</p>
                <p><strong>Memory Usage:</strong> ${data.memory_usage.toFixed(2)} MB</p>
                <p><strong>Line Count:</strong> ${data.line_count}</p>
                <p><strong>Function Count:</strong> ${data.function_count}</p>
                <p><strong>Variable Count:</strong> ${data.variable_count}</p>
                <p><strong>Code Complexity:</strong> ${data.complexity.toFixed(2)}</p>
                <p><strong>Loop Count:</strong> ${data.loop_count}</p>
                <p><strong>Conditional Count:</strong> ${data.conditional_count}</p>
                <p><strong>Readability Score:</strong> ${data.readability_score}</p>

                <h3>Overall Code Performance Score</h3>
                <p>${calculatePerformanceScore(data)}</p>
            `;
        }
    })
    .catch(error => {
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}

function calculatePerformanceScore(results) {
    // Calculate a performance score based on various metrics
    const score = (100 - results.execution_time * 10) + (100 - results.memory_usage / 2) + (results.readability_score * 10);
    return `Performance Score: ${Math.min(Math.max(score, 0), 100).toFixed(2)}%`;
}
