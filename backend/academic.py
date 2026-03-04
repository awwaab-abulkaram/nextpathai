import json
import random
import os

# ==========================================
# FILE PATH
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTIONS_FILE = os.path.join(BASE_DIR, "academic_questions.json")


# ==========================================
# LOAD + RANDOMIZE QUESTIONS
# ==========================================

def load_academic_questions():

    with open(QUESTIONS_FILE, "r") as f:
        data = json.load(f)

    selected_questions = []

    for subject in ["Physics", "Chemistry", "Biology"]:

        subject_questions = data.get(subject, [])

        chosen_questions = random.sample(
            subject_questions,
            min(7, len(subject_questions))
        )

        for q in chosen_questions:

            options = q["options"].copy()
            random.shuffle(options)  # shuffle options

            selected_questions.append({
                "id": q["id"],
                "subject": subject,
                "text": q["text"],
                "options": options
            })

    # shuffle full quiz order
    random.shuffle(selected_questions)

    return selected_questions


# ==========================================
# ANSWER LOOKUP MAP
# ==========================================

def get_answer_map():

    with open(QUESTIONS_FILE, "r") as f:
        data = json.load(f)

    answer_map = {}

    for subject, questions in data.items():
        for q in questions:
            answer_map[q["id"]] = {
                "subject": subject,
                "answer": q["answer"]
            }

    return answer_map


# ==========================================
# SCORING
# ==========================================

def calculate_academic_scores(responses):

    """
    responses example:

    {
        "p1": "Newton",
        "c4": "2",
        "b2": "Cell"
    }
    """

    answer_map = get_answer_map()

    scores = {
        "Physics": 0,
        "Chemistry": 0,
        "Biology": 0
    }

    totals = {
        "Physics": 0,
        "Chemistry": 0,
        "Biology": 0
    }

    for qid, user_answer in responses.items():

        if qid in answer_map:

            subject = answer_map[qid]["subject"]
            correct_answer = answer_map[qid]["answer"]

            totals[subject] += 1

            if user_answer == correct_answer:
                scores[subject] += 1

    normalized_scores = {
        subject: (scores[subject] / totals[subject]) if totals[subject] > 0 else 0
        for subject in scores
    }

    return normalized_scores


# ==========================================
# ACADEMIC LEVEL CLASSIFIER
# ==========================================

def academic_level(score):

    if score >= 0.8:
        return "Strong"
    elif score >= 0.5:
        return "Moderate"
    else:
        return "Needs Improvement"


# ==========================================
# REPORT GENERATION
# ==========================================

def generate_academic_report(scores):

    report = {}

    for subject, score in scores.items():

        report[subject] = {
            "score": round(score, 2),
            "level": academic_level(score)
        }

    return report


# ==========================================
# STREAM RECOMMENDATION ENGINE
# ==========================================

def recommend_stream(scores):

    physics = scores.get("Physics", 0)
    chemistry = scores.get("Chemistry", 0)
    biology = scores.get("Biology", 0)

    # Engineering oriented
    if physics >= 0.65 and chemistry >= 0.55 and biology < 0.6:
        return {
            "stream": "Engineering",
            "reason": "Strong foundation in Physics and Chemistry suggests suitability for engineering disciplines."
        }

    # Medical oriented
    if biology >= 0.7 and chemistry >= 0.6:
        return {
            "stream": "Medical",
            "reason": "Strong Biology and Chemistry performance aligns well with medical and life science careers."
        }

    # Pure sciences
    if physics >= 0.6 and chemistry >= 0.6 and biology >= 0.6:
        return {
            "stream": "Pure Sciences",
            "reason": "Balanced scientific knowledge across Physics, Chemistry, and Biology indicates potential in research and scientific studies."
        }

    # fallback
    return {
        "stream": "Commerce Shift Suggestion",
        "reason": "Academic performance suggests exploring non-science streams such as commerce, management, or business studies."
    }