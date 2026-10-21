# 🧠 Mental Health Score Predictor

### Decode Your Stress. Understand Your Signals.

A machine learning-powered web application that analyzes user-provided lifestyle, academic, and other relevant features to predict a mental health-related score. Built using Python, data science and machine learning libraries, FastAPI, Pydantic, and a custom HTML, CSS, and JavaScript frontend, with deployment on Render.

🔗 **Live Demo:** [Try the Application](https://bheja-fry-ai-score-predictor-1.onrender.com)  

---

## ✨ Overview

Mental well-being can be influenced by several interconnected factors, including lifestyle habits, academic pressure, sleep patterns, and daily routines.

**Mental Health Score Predictor** is an end-to-end machine learning project that explores patterns in user-provided data and estimates a mental health-related score using a trained ML model.

The project combines data analysis, visualization, model development, backend API engineering, input validation, and frontend development into a single deployable application.

> ⚠️ **Disclaimer:** This application is an educational machine learning project. Its predictions are not medical diagnoses, do not replace professional mental health assessments, and should not be used as the sole basis for health-related decisions.

## 🚀 Features

- 🧠 **ML-Powered Prediction** — Generates a predicted score using a trained machine learning model.
- 📊 **Exploratory Data Analysis** — Investigates distributions, relationships, correlations, and patterns in the dataset.
- 📈 **Data Visualization** — Uses statistical plots and charts to communicate insights.
- ⚡ **FastAPI Backend** — Exposes prediction functionality through REST API endpoints.
- 🛡️ **Pydantic Validation** — Validates incoming data and enforces input schemas.
- 🎨 **Interactive Web Interface** — Built using HTML, CSS, and JavaScript.
- 🔄 **End-to-End ML Pipeline** — Connects preprocessing, inference, API handling, and frontend interaction.
- ☁️ **Cloud Deployment** — Deployed on Render for online access.
- 🧩 **Modular Architecture** — Separates frontend, backend, and machine learning logic for maintainability.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Language | Python |
| Data Manipulation | NumPy, Pandas |
| Visualization | Matplotlib, Seaborn |
| Machine Learning | Scikit-learn |
| Model Evaluation | Accuracy, Precision, Recall, F1-score, MAE, RMSE, as applicable to the task |
| Backend | FastAPI, Uvicorn |
| Data Validation | Pydantic |
| Frontend | HTML5, CSS3, JavaScript |
| API Communication | REST API, JSON, Fetch API |
| Model Persistence | Joblib 
| Deployment | Render |
| Development Tools | Jupyter Notebook, VS Code, Git, GitHub |

*The listed metrics and libraries should be adjusted to match the ones actually used in the project.*

## 🔬 Machine Learning Workflow

The project follows a typical end-to-end machine learning workflow.

1. **Data Collection** — Load the dataset and inspect its features and target variable.
2. **Data Cleaning** — Identify missing values, duplicate records, inconsistent values, and data quality issues.
3. **Exploratory Data Analysis (EDA)** — Study feature distributions, correlations, and relationships with the target.
4. **Feature Engineering** — Prepare relevant features and encode or transform them when necessary.
5. **Preprocessing** — Apply suitable scaling, encoding, and imputation using a reproducible pipeline where appropriate.
6. **Train-Test Split** — Separate training and evaluation data to estimate generalization performance.
7. **Model Training** — Train and compare suitable machine learning algorithms.
8. **Model Evaluation** — Evaluate the final model using metrics appropriate to regression or classification.
9. **Model Serialization** — Save the trained model and any required preprocessing objects.
10. **Deployment** — Load the saved artifacts in the FastAPI backend and serve predictions through the web application.

### 📊 Model Evaluation

The evaluation method depends on the prediction target.

- **Regression:** MAE, MSE, RMSE, and \(R^2\).
- **Classification:** Accuracy, Precision, Recall, F1-score, and a confusion matrix.

Final model results should be reported using actual held-out test results rather than assumed values.

## 🏗️ System Architecture

```text
              USER
               |
               v
     HTML + CSS + JavaScript
               |
        Fetch API / JSON
               |
               v
        FastAPI Backend
               |
               v
      Pydantic Validation
               |
               v
    Preprocessing + ML Model
               |
               v
       Predicted Score
               |
               v
      JSON API Response
               |
               v
      Frontend Result UI
```

## 📁 Project Structure

```text
mental-health-score-predictor/
│
├── app/
│   ├── main.py               # FastAPI application
│   ├── schemas.py            # Pydantic request/response models
│   ├── model.py              # Model loading and prediction logic
│   └── preprocessing.py      # Input preprocessing, if separated
│
├── models/
│   └── model.pkl             # Trained model artifact
│
├── notebooks/
│   └── eda_and_model.ipynb   # EDA, experiments, model training
│
├── static/
│   ├── style.css             # Stylesheets
│   └── script.js             # Frontend logic
│
├── templates/
│   └── index.html            # Web interface
│
├── data/
│   └── README.md             # Dataset details; keep large/private data out of Git
│
├── requirements.txt          # Python dependencies
├── .gitignore
└── README.md
```

*This is a suggested structure. Adjust the filenames and directories to match your actual repository.*

## ⚙️ Installation and Setup

### Prerequisites

- Python 3.10 or a compatible version supported by your dependencies
- Git
- pip
