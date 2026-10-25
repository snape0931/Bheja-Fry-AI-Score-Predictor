# 🧠 Bheja Fry AI — Mental Health Score Predictor

### 🧠 Decode Your Stress. Understand Your Signals.

An end-to-end Machine Learning web application that analyzes student lifestyle and social media usage patterns to predict a mental health-related score. Built using Python, Scikit-learn, FastAPI, and a custom interactive frontend.

🔗 **GitHub Repository:** [Bheja Fry AI — Score Predictor](https://github.com/snape0931/Bheja-Fry-AI-Score-Predictor)

🚀 **Live Demo:** [Try the Application](https://bheja-fry-ai-score-predictor-1.onrender.com)

---

## ✨ Features

- 🧠 **ML-Powered Predictions** — Estimates a mental health-related score using a trained machine learning model.
- 📊 **Exploratory Data Analysis** — Explores trends, distributions, correlations, and relationships in the dataset.
- 📱 **Student-Centric Inputs** — Uses demographic, academic, and social media usage information.
- ⚡ **FastAPI Backend** — Handles prediction requests through a REST API.
- 🛡️ **Input Validation** — Uses Pydantic to validate incoming data.
- 🎨 **Interactive Frontend** — Custom-designed interface with a purple, pink, and black theme.
- 🔗 **Frontend–Backend Integration** — Connects the user interface to the ML model through API requests.
- 📦 **Model Persistence** — Loads a saved machine learning model for inference.
- ☁️ **Cloud Deployment** — Deployed on Render for online access.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Language | Python |
| Data Analysis | NumPy, Pandas |
| Data Visualization | Matplotlib, Seaborn |
| Machine Learning | Scikit-learn |
| Backend | FastAPI, Uvicorn |
| Data Validation | Pydantic |
| Model Persistence | Joblib / Pickle |
| Frontend | HTML5, CSS3, JavaScript |
| API Communication | REST API, JSON, Fetch API |
| Development | Jupyter Notebook, VS Code |
| Version Control | Git, GitHub |
| Deployment | Render |

## 📊 Dataset

The project uses the **Student Social Media and Mental Health Impact** dataset to explore relationships between social media usage and student well-being.

The dataset contains information relating to:

- 👤 **Demographics:** Age, gender, and academic level.
- 🌍 **Background:** Country and related demographic information.
- 📱 **Social Media Usage:** Platforms used by students.
- 🎯 **Usage Purpose:** Networking, education, entertainment, and news.

The dataset is explored and processed to support model development and score prediction.

## 🔬 Machine Learning Workflow

1. 📥 **Data Loading** — Load the dataset and inspect its structure.
2. 🧹 **Data Preprocessing** — Prepare relevant features for analysis and modeling.
3. 📊 **Exploratory Data Analysis** — Investigate distributions, correlations, and patterns.
4. 🧩 **Feature Preparation** — Select and transform the input features required by the model.
5. 🧠 **Model Development** — Train and evaluate the machine learning model.
6. 📦 **Model Persistence** — Save the trained model as `Mental_Health_Model.pkl`.
7. ⚡ **Backend Integration** — Load the model through the FastAPI application.
8. 🌐 **Prediction** — Accept validated user inputs and return predictions to the frontend.
9. ☁️ **Deployment** — Deploy the application for web-based access.

## 🏗️ System Architecture

```text
          👤 User
            |
            v
    HTML + CSS + JavaScript
            |
            v
      Fetch API / JSON
            |
            v
       FastAPI Backend
            |
            v
    Pydantic Validation
            |
            v
      Trained ML Model
  Mental_Health_Model.pkl
            |
            v
    Predicted Score
            |
            v
      JSON Response
            |
            v
     Frontend Results
```

## 📂 Project Structure

```text
Bheja-Fry-AI-Score-Predictor/
│
├── .ipynb_checkpoints/                    # Notebook checkpoints
├── anaconda_projects/db/                  # Project data directory
├── MHSP.ipynb                             # ML development and analysis
├── ML Project.html                        # Exported notebook/report
├── Mental_Health_Model.pkl                # Trained ML model
├── Student Social Media And Mental Health Impact.csv
│                                          # Dataset
├── index.html                             # Web interface
├── style.css                              # Frontend styling
├── script.js                              # Frontend interactions
├── main.py                                # FastAPI backend
├── requirements.txt                       # Python dependencies
└── README.md                              # Project documentation
```

## 🚀 Deployment

The application is deployed on **Render**.

🔗 **Live Application:** [Bheja Fry AI](https://bheja-fry-ai-score-predictor-1.onrender.com)

The free tier of Render has resource and bandwidth limitations that may affect application performance and responsiveness.

## 💻 Run Locally

### 📋 Prerequisites

- Python 3.10 or a compatible version
- Git
- pip

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/snape0931/Bheja-Fry-AI-Score-Predictor.git
cd Bheja-Fry-AI-Score-Predictor
```

### 2️⃣ Create a Virtual Environment

```bash
python -m venv venv
```

**Windows**

```bash
venv\Scripts\activate
```

**macOS/Linux**

```bash
source venv/bin/activate
```

### 3️⃣ Install Dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4️⃣ Start the Application

```bash
python -m uvicorn main:app --reload
```

### 5️⃣ Open in Your Browser

- 🌐 **Web Interface:** http://127.0.0.1:8000
- 📖 **Interactive API Documentation:** http://127.0.0.1:8000/docs

Keep the terminal running while using the locally hosted application.


## 👩‍💻 Author

**Saumya Srivastava**

🔗 [Project Repository](https://github.com/snape0931/Bheja-Fry-AI-Score-Predictor)

---

⭐ If you find this project interesting, consider giving the repository a star!
