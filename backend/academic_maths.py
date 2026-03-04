import json
import random
import os

# ==========================================
# FILE PATH
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
QUESTIONS_FILE = os.path.join(BASE_DIR, "math_questions.json")


# ==========================================
# LOAD + RANDOMIZE QUESTIONS
# ==========================================

def load_math_questions():

    with open(QUESTIONS_FILE, "r") as f:
        data = json.load(f)

    selected_questions = []

    for domain in ["Algebra", "Mensuration", "Probability", "Sets"]:

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
# ANSWER LOOKUP MAP
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

def calculate_math_scores(responses):

    """
    responses example

    {
        "a1": "x = 5",
        "m3": "πr²",
        "p2": "1/2",
        "s4": "{1,2,3}"
    }
    """

    answer_map = get_answer_map()

    scores = {
        "Algebra": 0,
        "Mensuration": 0,
        "Probability": 0,
        "Sets": 0
    }

    totals = {
        "Algebra": 0,
        "Mensuration": 0,
        "Probability": 0,
        "Sets": 0
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
# PERFORMANCE LEVEL
# ==========================================

def math_level(score):

    if score >= 0.8:
        return "Strong"
    elif score >= 0.5:
        return "Moderate"
    else:
        return "Needs Improvement"


# ==========================================
# REPORT GENERATION
# ==========================================

def generate_math_report(scores):

    report = {}

    for domain, score in scores.items():

        report[domain] = {
            "score": round(score, 2),
            "level": math_level(score)
        }

    return report


# ==========================================
# MATH STREAM SUGGESTION
# ==========================================

def recommend_math_path(scores):

    algebra = scores.get("Algebra", 0)
    mensuration = scores.get("Mensuration", 0)
    probability = scores.get("Probability", 0)
    sets = scores.get("Sets", 0)

    if algebra >= 0.7 and probability >= 0.6:
        return {
            "path": "Engineering / Computer Science",
            "reason": "Strong performance in Algebra and Probability suggests aptitude for analytical and computational fields."
        }

    if mensuration >= 0.7 and algebra >= 0.6:
        return {
            "path": "Architecture / Engineering Design",
            "reason": "Strong spatial and measurement skills suggest suitability for architecture or engineering design."
        }

    if probability >= 0.7 and sets >= 0.6:
        return {
            "path": "Data Science / Statistics",
            "reason": "Strong probability and logical set understanding indicates potential in statistics and data science."
        }

    return {
        "path": "General Mathematics Foundation",
        "reason": "Mathematical fundamentals need strengthening before specializing."
    }