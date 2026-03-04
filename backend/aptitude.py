import json
import random

# ==============================
# LOAD QUESTION BANK
# ==============================

with open("questions_tagged.json", "r", encoding="utf-8") as file:
    questions = json.load(file)

for q in questions:
    q["dimension"] = q["dimension"].strip()


# ==============================
# SELECT QUESTIONS (Balanced)
# ==============================

def select_aptitude_questions():

    quant = [q for q in questions if q["dimension"] == "Quantitative Aptitude"]
    verbal = [q for q in questions if q["dimension"] == "Verbal Reasoning"]
    logical = [q for q in questions if q["dimension"] == "Logical Reasoning"]
    general = [q for q in questions if q["dimension"] == "General"]

    selected = []
    selected += random.sample(quant, 5)
    selected += random.sample(verbal, 5)
    selected += random.sample(logical, 5)
    selected += random.sample(general, 5)

    random.shuffle(selected)

    return selected


# ==============================
# REMOVE ANSWERS BEFORE SENDING
# ==============================

def sanitize_questions(question_set):

    safe_questions = []

    for q in question_set:
        temp = q.copy()
        temp.pop("answer")
        safe_questions.append(temp)

    return safe_questions


# ==============================
# CALCULATE APTITUDE SCORES
# ==============================

def calculate_aptitude_scores(user_answers, question_set):

    scores = {
        "Quantitative Aptitude": 0,
        "Verbal Reasoning": 0,
        "Logical Reasoning": 0,
        "General": 0
    }

    dimension_count = {
        "Quantitative Aptitude": 4,
        "Verbal Reasoning": 4,
        "Logical Reasoning": 4,
        "General": 3
    }

    for i, q in enumerate(question_set):

        if str(i) in user_answers:

            if user_answers[str(i)] == q["answer"]:
                scores[q["dimension"]] += 1

    # Normalize to percentage
    for key in scores:
        scores[key] = (scores[key] / dimension_count[key]) * 100

    return scores


# ==============================
# CAREER RECOMMENDATION
# ==============================

def generate_aptitude_report(scores):

    engineering = (
        0.5 * scores["Quantitative Aptitude"] +
        0.3 * scores["Logical Reasoning"] +
        0.1 * scores["Verbal Reasoning"] +
        0.1 * scores["General"]
    )

    commerce = (
        0.5 * scores["Verbal Reasoning"] +
        0.3 * scores["General"] +
        0.1 * scores["Quantitative Aptitude"] +
        0.1 * scores["Logical Reasoning"]
    )

    difference = abs(engineering - commerce)

    if engineering > commerce:
        recommendation = "Engineering"
    elif commerce > engineering:
        recommendation = "Commerce"
    else:
        recommendation = "Balanced"

    report = {
        "scores": scores,
        "engineering": round(engineering, 2),
        "commerce": round(commerce, 2),
        "recommendation": recommendation,
        "confidence": round(difference, 2)
    }

    return report