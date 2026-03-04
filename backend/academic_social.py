import json
import random
import os

# ==========================================
# FILE PATH
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTIONS_FILE = os.path.join(BASE_DIR, "social_questions.json")


# ==========================================
# LOAD + RANDOMIZE QUESTIONS
# ==========================================

def load_social_questions():

    with open(QUESTIONS_FILE, "r") as f:
        data = json.load(f)

    selected_questions = []

    for domain in ["History", "Civics", "Economics", "Geography"]:

        domain_questions = data.get(domain, [])

        chosen_questions = random.sample(
            domain_questions,
            min(5, len(domain_questions))
        )

        for q in chosen_questions:

            options = q["options"].copy()
            random.shuffle(options)

            selected_questions.append({
                "id": q["id"],
                "domain": domain,
                "text": q["text"],
                "options": options
            })

    random.shuffle(selected_questions)

    return selected_questions


# ==========================================
# ANSWER MAP
# ==========================================

def get_answer_map():

    with open(QUESTIONS_FILE, "r") as f:
        data = json.load(f)

    answer_map = {}

    for domain, questions in data.items():
        for q in questions:
            answer_map[q["id"]] = {
                "domain": domain,
                "answer": q["answer"]
            }

    return answer_map


# ==========================================
# SCORING
# ==========================================

def calculate_social_scores(responses):

    answer_map = get_answer_map()

    scores = {
        "History": 0,
        "Civics": 0,
        "Economics": 0,
        "Geography": 0
    }

    totals = {
        "History": 0,
        "Civics": 0,
        "Economics": 0,
        "Geography": 0
    }

    for qid, user_answer in responses.items():

        if qid in answer_map:

            domain = answer_map[qid]["domain"]
            correct_answer = answer_map[qid]["answer"]

            totals[domain] += 1

            if user_answer == correct_answer:
                scores[domain] += 1

    normalized_scores = {
        domain: (scores[domain] / totals[domain]) if totals[domain] > 0 else 0
        for domain in scores
    }

    return normalized_scores


# ==========================================
# LEVEL CLASSIFIER
# ==========================================

def social_level(score):

    if score >= 0.8:
        return "Strong"
    elif score >= 0.5:
        return "Moderate"
    else:
        return "Needs Improvement"


# ==========================================
# REPORT
# ==========================================

def generate_social_report(scores):

    report = {}

    for domain, score in scores.items():

        report[domain] = {
            "score": round(score, 2),
            "level": social_level(score)
        }

    return report


# ==========================================
# CAREER SUGGESTION
# ==========================================

def recommend_social_path(scores):

    history = scores.get("History", 0)
    civics = scores.get("Civics", 0)
    economics = scores.get("Economics", 0)
    geography = scores.get("Geography", 0)

    if economics >= 0.7:
        return {
            "path": "Economics / Finance",
            "reason": "Strong economic understanding suggests aptitude for finance, economics, and business studies."
        }

    if civics >= 0.7 and history >= 0.6:
        return {
            "path": "Law / Political Science",
            "reason": "Strong civics and historical awareness align well with legal and political science careers."
        }

    if geography >= 0.7:
        return {
            "path": "Geography / Environmental Studies",
            "reason": "Strong geographical knowledge suggests potential in environmental science or geospatial fields."
        }

    return {
        "path": "Humanities Foundation",
        "reason": "Strengthening fundamentals across social sciences can help determine a specialization."
    }