import time
import tracemalloc
import ast
from flask import Flask, request, jsonify

app = Flask(__name__)

# Function to safely execute Python code and capture performance metrics
def execute_code(code):
    # Start measuring memory usage
    tracemalloc.start()

    # Start measuring time
    start_time = time.time()

    # Initialize a dictionary to capture the execution output and errors
    result = {
        'output': '',
        'error': '',
        'execution_time': 0,
        'cpu_time': 0,
        'memory_usage': 0,
        'line_count': 0,
        'function_count': 0,
        'variable_count': 0,
        'complexity': 0,
        'loop_count': 0,
        'conditional_count': 0,
        'readability_score': 0
    }

    try:
        # Executing the code
        exec_globals = {}
        exec(code, exec_globals)
        result['output'] = "Code executed successfully."

    except Exception as e:
        result['error'] = str(e)

    # Calculate performance metrics
    end_time = time.time()
    result['execution_time'] = end_time - start_time

    # Measure memory usage
    current, peak = tracemalloc.get_traced_memory()
    result['memory_usage'] = peak / 10**6  # Convert to MB

    # Calculate code analysis details
    result['line_count'] = len(code.split('\n'))
    result['function_count'] = len([n for n in ast.walk(ast.parse(code)) if isinstance(n, ast.FunctionDef)])
    result['variable_count'] = len([n for n in ast.walk(ast.parse(code)) if isinstance(n, ast.Name)])
    result['loop_count'] = len([n for n in ast.walk(ast.parse(code)) if isinstance(n, (ast.For, ast.While))])
    result['conditional_count'] = len([n for n in ast.walk(ast.parse(code)) if isinstance(n, (ast.If, ast.Elif))])

    # Complexity (simplified)
    result['complexity'] = (result['loop_count'] + result['conditional_count']) / (result['line_count'] or 1)

    # Readability score (simulated based on line count and function count)
    result['readability_score'] = max(0, min(10, (100 - result['line_count'] / 10 + result['function_count'] / 2)))

    return result

# Route to handle code analysis
@app.route('/run_code', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data.get('code')

    if not code:
        return jsonify({'error': 'No code provided'}), 400

    result = execute_code(code)

    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
