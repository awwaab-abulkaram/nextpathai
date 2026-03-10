import joblib
import numpy as np
import os

# Path of this directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load trained components
model = joblib.load(os.path.join(BASE_DIR, "mbti_rf_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "mbti_scaler.pkl"))
label_encoder = joblib.load(os.path.join(BASE_DIR, "mbti_label_encoder.pkl"))


def predict_mbti(answers):
    """
    Predict MBTI type from questionnaire answers
    answers: list of 60 Likert-scale responses
    """

    if len(answers) != 60:
        raise ValueError("Expected 60 answers for MBTI prediction")

    # Convert to numpy
    answers = np.array(answers).reshape(1, -1)

    # Scale input
    scaled_input = scaler.transform(answers)

    # Predict MBTI
    prediction = model.predict(scaled_input)

    # Decode label
    personality = label_encoder.inverse_transform(prediction)[0]

    # Confidence score
    probs = model.predict_proba(scaled_input)
    confidence = float(np.max(probs))

    return personality, confidence