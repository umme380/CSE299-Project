# --- START OF FILE app.py ---

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import pickle
import pandas as pd
import numpy as np
import joblib
import xgboost as xgb
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# --- DATABASE CONFIGURATION ---
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dyslexia_app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- DATABASE MODELS ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False) # 'student' or 'teacher'
    risk_level = db.Column(db.String(20), nullable=True) 

class Assignment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    text = db.Column(db.Text, nullable=False)
    task_type = db.Column(db.String(20), default='hybrid') 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(80), nullable=False)
    assignment_id = db.Column(db.Integer, db.ForeignKey('assignment.id'), nullable=False)
    accuracy = db.Column(db.Float, nullable=False)
    transcript = db.Column(db.Text, nullable=True)
    submission_text = db.Column(db.Text, nullable=True)
    mode = db.Column(db.String(20), default='reading')
    assignment = db.relationship('Assignment', backref=db.backref('results', lazy=True))

with app.app_context():
    db.create_all()

# --- ML LOADING ---
def load_model_file(filename):
    path = os.path.join(os.getcwd(), filename)
    if not os.path.exists(path): return None
    try:
        with open(path, 'rb') as f: return pickle.load(f)
    except:
        try: return joblib.load(path)
        except: return None

model = load_model_file('dyslexia_85_model.pkl')
scaler = load_model_file('scaler.pkl')
imputer = load_model_file('imputer.pkl')

# --- ROUTES ---

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 400
    
    hashed_pw = generate_password_hash(data['password'])
    new_user = User(username=data['username'], password_hash=hashed_pw, role=data['role'])
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    
    if user and check_password_hash(user.password_hash, data['password']):
        return jsonify({
            "id": user.id, 
            "username": user.username, 
            "role": user.role,
            "risk_level": user.risk_level 
        })
    
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/assignments', methods=['GET', 'POST'])
def handle_assignments():
    if request.method == 'POST':
        data = request.json
        new_assign = Assignment(title=data['title'], text=data['text'], task_type='hybrid')
        db.session.add(new_assign)
        db.session.commit()
        return jsonify({"message": "Assignment created"}), 201
    
    assignments = Assignment.query.order_by(Assignment.created_at.desc()).all()
    return jsonify([{"id": a.id, "title": a.title, "text": a.text, "task_type": a.task_type} for a in assignments])

@app.route('/submit_result', methods=['POST'])
def submit_result():
    data = request.json
    new_result = Result(
        student_name=data['student_name'],
        assignment_id=data['assignment_id'],
        accuracy=data.get('accuracy', 0),
        transcript=data.get('transcript', ''),
        submission_text=data.get('submission_text', ''),
        mode=data.get('mode', 'reading')
    )
    db.session.add(new_result)
    db.session.commit()
    return jsonify({"message": "Score saved"}), 201

@app.route('/teacher/results', methods=['GET'])
def get_results():
    results = Result.query.all()
    output = []
    for r in results:
        output.append({
            "student": r.student_name,
            "assignment": r.assignment.title,
            "mode": r.mode,
            "accuracy": r.accuracy,
            "transcript": r.transcript,
            "submission_text": r.submission_text
        })
    return jsonify(output)

@app.route('/predict', methods=['POST'])
def predict():
    if not model: return jsonify({"error": "No model"}), 500
    try:
        data = request.json
        scores = [int(data.get(k, 5)) for k in ['F1_Rhyme','F2_Alliteration','F3_SoundSegmentation','F4_WordReadingSpeed','F5_NonWordReading','F6_Spelling','F7_VisualPerception','F8_MemorySpan','F9_RapidNaming']]
        input_avg = sum(scores) / len(scores)
        
        features = {
            'Gender': 1 if data.get('Gender') == 'Male' else 0,
            'NativeLang': int(data.get('NativeLang_Code', 1)), 'OtherLang': 1, 
            'Age': int(data.get('Age', 10)),
            'F1': scores[0], 'F2': scores[1], 'F3': scores[2], 'F4': scores[3],
            'F5': scores[4], 'F6': scores[5], 'F7': scores[6], 'F8': scores[7], 'F9': scores[8],
        }
        for i in range(10, 23): features[f'F{i}'] = input_avg
        df = pd.DataFrame([features])

        try:
            if hasattr(imputer, 'feature_names_in_'): df = df.reindex(columns=imputer.feature_names_in_, fill_value=0)
            df_scaled = scaler.transform(imputer.transform(df))
        except: df_scaled = df 

        if hasattr(model, 'predict_proba'):
            prob = model.predict_proba(df_scaled)[0][1] * 100
            pred = model.predict(df_scaled)[0]
        else:
            pred = model.predict(df_scaled)[0]
            prob = 100 if pred == 1 else 0

        final_result = "Normal" if input_avg >= 7.5 else ("High Risk" if pred == 1 or prob > 50 else "Normal")
        
        # Save result to user profile
        user_id = data.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                user.risk_level = final_result
                db.session.commit()

        return jsonify({ "riskLevel": final_result, "probability": round(prob, 2) })
    except Exception as e: return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)