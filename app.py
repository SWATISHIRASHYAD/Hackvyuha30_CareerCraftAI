from flask import Flask, render_template, request, redirect, url_for
import json
import math

app = Flask(__name__)

# Career paths data with their respective learning phases
CAREER_PATHS = {
    "data_scientist": {
        "title": "Data Scientist",
        "phases": [
            {"name": "Foundation", "description": "Learn Python, statistics, and data analysis libraries (Pandas, NumPy)"},
            {"name": "Visualization & SQL", "description": "Master data visualization (Matplotlib, Seaborn) and database querying"},
            {"name": "Machine Learning", "description": "Study ML algorithms, scikit-learn, and model evaluation techniques"},
            {"name": "Deep Learning", "description": "Learn neural networks, TensorFlow/PyTorch, and specialized architectures"},
            {"name": "Specialization", "description": "Focus on NLP, computer vision, or time series analysis"},
            {"name": "Projects & Portfolio", "description": "Build end-to-end projects showcasing your skills"}
        ]
    },
    "frontend_developer": {
        "title": "Frontend Developer",
        "phases": [
            {"name": "HTML/CSS Basics", "description": "Learn semantic HTML and CSS fundamentals"},
            {"name": "JavaScript Essentials", "description": "Master JavaScript core concepts and DOM manipulation"},
            {"name": "Responsive Design", "description": "Learn Flexbox, Grid, and mobile-first development principles"},
            {"name": "Frontend Framework", "description": "Choose and learn React, Vue, or Angular"},
            {"name": "State Management", "description": "Understand state management patterns and tools"},
            {"name": "Performance & Deployment", "description": "Study optimization techniques and deployment workflows"}
        ]
    },
    "backend_developer": {
        "title": "Backend Developer", 
        "phases": [
            {"name": "Programming Language", "description": "Master a backend language (Python, Node.js, Java, etc.)"},
            {"name": "Web Frameworks", "description": "Learn frameworks like Flask, Express, Spring, etc."},
            {"name": "Databases", "description": "Master SQL and NoSQL databases and ORM concepts"},
            {"name": "API Development", "description": "Build RESTful and GraphQL APIs with authentication"},
            {"name": "Server Management", "description": "Learn deployment, CI/CD, and basic DevOps principles"},
            {"name": "Security Best Practices", "description": "Understand web security, data protection, and secure coding"}
        ]
    },
    "ml_engineer": {
        "title": "Machine Learning Engineer",
        "phases": [
            {"name": "Programming Skills", "description": "Master Python and ML libraries (NumPy, Pandas, scikit-learn)"},
            {"name": "ML Fundamentals", "description": "Learn algorithms, feature engineering, and model evaluation"},
            {"name": "Deep Learning", "description": "Study neural networks with TensorFlow or PyTorch"},
            {"name": "Big Data Technologies", "description": "Learn tools like Spark, Hadoop for large-scale ML"},
            {"name": "MLOps", "description": "Master model deployment, monitoring, and maintenance"},
            {"name": "Advanced Topics", "description": "Explore reinforcement learning, GANs, or other specialized areas"}
        ]
    },
    "devops_engineer": {
        "title": "DevOps Engineer",
        "phases": [
            {"name": "Fundamentals", "description": "Learn Linux, networking, and cloud computing basics"},
            {"name": "Infrastructure as Code", "description": "Master tools like Terraform, CloudFormation, or Pulumi"},
            {"name": "Containerization", "description": "Learn Docker and container orchestration with Kubernetes"},
            {"name": "CI/CD Pipelines", "description": "Build automation with Jenkins, GitHub Actions, or GitLab CI"},
            {"name": "Monitoring & Observability", "description": "Implement monitoring using Prometheus, Grafana, ELK stack"},
            {"name": "Security & Compliance", "description": "Apply DevSecOps principles and compliance automation"}
        ]
    }
}

def calculate_phase_duration(total_months, num_phases):
    """Calculate duration for each phase based on total months."""
    base_duration = math.floor(total_months / num_phases)
    remainder = total_months % num_phases
    
    # Distribute the remainder across phases
    durations = [base_duration] * num_phases
    for i in range(remainder):
        durations[i] += 1
        
    return durations

@app.route('/')
def index():
    return render_template('index.html', career_paths=CAREER_PATHS)

@app.route('/generate', methods=['POST'])
def generate_roadmap():
    career_path = request.form.get('career_path')
    duration_months = int(request.form.get('duration_months'))
    
    if career_path not in CAREER_PATHS:
        return redirect(url_for('index'))
    
    path_data = CAREER_PATHS[career_path]
    num_phases = len(path_data['phases'])
    phase_durations = calculate_phase_duration(duration_months, num_phases)
    
    roadmap = {
        'title': path_data['title'],
        'total_months': duration_months,
        'phases': []
    }
    
    start_month = 1
    for i, phase in enumerate(path_data['phases']):
        end_month = start_month + phase_durations[i] - 1
        roadmap['phases'].append({
            'name': phase['name'],
            'description': phase['description'],
            'start_month': start_month,
            'end_month': end_month,
            'duration': phase_durations[i]
        })
        start_month = end_month + 1
    
    return render_template('roadmap.html', roadmap=roadmap)

if __name__ == '__main__':
    app.run(debug=True)