import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

RIASEC_QUESTIONS = {
    "R": [
        {"id": "r1", "text": "Build kitchen cabinets"},
        {"id": "r2", "text": "Lay brick or tile"},
        {"id": "r3", "text": "Repair household appliances"},
        {"id": "r4", "text": "Raise fish in a fish hatchery"},
        {"id": "r5", "text": "Assemble electronic parts"},
        {"id": "r6", "text": "Drive a truck to deliver packages"},
        {"id": "r7", "text": "Test the quality of parts before shipment"},
        {"id": "r8", "text": "Repair and install locks"},
        {"id": "r9", "text": "Set up and operate machines"},
        {"id": "r10", "text": "Put out forest fires"}
    ],
    "I": [
        {"id": "i1", "text": "Develop a new medicine"},
        {"id": "i2", "text": "Study ways to reduce water pollution"},
        {"id": "i3", "text": "Conduct chemical experiments"},
        {"id": "i4", "text": "Study the movement of planets"},
        {"id": "i5", "text": "Examine blood samples"},
        {"id": "i6", "text": "Investigate the cause of a fire"},
        {"id": "i7", "text": "Develop better weather prediction methods"},
        {"id": "i8", "text": "Work in a biology lab"},
        {"id": "i9", "text": "Invent a replacement for sugar"},
        {"id": "i10", "text": "Do laboratory tests to identify diseases"}
    ],
    "A": [
        {"id": "a1", "text": "Write books or plays"},
        {"id": "a2", "text": "Play a musical instrument"},
        {"id": "a3", "text": "Compose or arrange music"},
        {"id": "a4", "text": "Draw pictures"},
        {"id": "a5", "text": "Create special effects for movies"},
        {"id": "a6", "text": "Paint sets for plays"},
        {"id": "a7", "text": "Write scripts for movies"},
        {"id": "a8", "text": "Perform jazz or tap dance"},
        {"id": "a9", "text": "Sing in a band"},
        {"id": "a10", "text": "Edit movies"}
    ],
    "S": [
        {"id": "s1", "text": "Teach an exercise routine"},
        {"id": "s2", "text": "Help people with emotional problems"},
        {"id": "s3", "text": "Give career guidance"},
        {"id": "s4", "text": "Perform rehabilitation therapy"},
        {"id": "s5", "text": "Do volunteer work"},
        {"id": "s6", "text": "Teach children sports"},
        {"id": "s7", "text": "Teach sign language"},
        {"id": "s8", "text": "Help conduct group therapy"},
        {"id": "s9", "text": "Take care of children"},
        {"id": "s10", "text": "Teach a high-school class"}
    ],
    "E": [
        {"id": "e1", "text": "Buy and sell stocks"},
        {"id": "e2", "text": "Manage a retail store"},
        {"id": "e3", "text": "Operate a beauty salon"},
        {"id": "e4", "text": "Manage a department"},
        {"id": "e5", "text": "Start your own business"},
        {"id": "e6", "text": "Negotiate business contracts"},
        {"id": "e7", "text": "Represent a client in a lawsuit"},
        {"id": "e8", "text": "Market a new line of clothing"},
        {"id": "e9", "text": "Sell merchandise"},
        {"id": "e10", "text": "Manage a clothing store"}
    ],
    "C": [
        {"id": "c1", "text": "Develop a spreadsheet"},
        {"id": "c2", "text": "Proofread records"},
        {"id": "c3", "text": "Install software across computers"},
        {"id": "c4", "text": "Operate a calculator"},
        {"id": "c5", "text": "Keep shipping records"},
        {"id": "c6", "text": "Calculate wages"},
        {"id": "c7", "text": "Inventory supplies"},
        {"id": "c8", "text": "Record rent payments"},
        {"id": "c9", "text": "Keep inventory records"},
        {"id": "c10", "text": "Stamp and distribute mail"}
    ]
}
# Question → Dimension mapping
QUESTION_MAP = {
    "r1": "R", "r2": "R", "r3": "R", "r4": "R", "r5": "R",
    "r6": "R", "r7": "R", "r8": "R", "r9": "R", "r10": "R",

    "i1": "I", "i2": "I", "i3": "I", "i4": "I", "i5": "I",
    "i6": "I", "i7": "I", "i8": "I", "i9": "I", "i10": "I",

    "a1": "A", "a2": "A", "a3": "A", "a4": "A", "a5": "A",
    "a6": "A", "a7": "A", "a8": "A", "a9": "A", "a10": "A",

    "s1": "S", "s2": "S", "s3": "S", "s4": "S", "s5": "S",
    "s6": "S", "s7": "S", "s8": "S", "s9": "S", "s10": "S",

    "e1": "E", "e2": "E", "e3": "E", "e4": "E", "e5": "E",
    "e6": "E", "e7": "E", "e8": "E", "e9": "E", "e10": "E",

    "c1": "C", "c2": "C", "c3": "C", "c4": "C", "c5": "C",
    "c6": "C", "c7": "C", "c8": "C", "c9": "C", "c10": "C",
}
RIASEC_DESCRIPTIONS = {
    "R": "You enjoy practical, hands-on activities and working with tools, machines, or physical tasks.",
    "I": "You are analytical and curious. You enjoy research, solving problems, and understanding how things work.",
    "A": "You are creative and expressive. You enjoy art, design, music, and innovative thinking.",
    "S": "You enjoy helping, teaching, and supporting others.",
    "E": "You are energetic and persuasive. You enjoy leadership, business, and influencing others.",
    "C": "You prefer structure, organization, and working with data or systems."
}


def calculate_riasec(responses):

    scores = {"R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0}

    for question_id, value in responses.items():
        if question_id in QUESTION_MAP:
            dimension = QUESTION_MAP[question_id]
            scores[dimension] += 1 if value else 0

    # ----- Normalization -----
    MAX_SCORE_PER_DIMENSION = 10  # since 10 questions each
    MIN_SCORE_PER_DIMENSION = 0

    normalized_scores = {
        k: (v - MIN_SCORE_PER_DIMENSION) / 
           (MAX_SCORE_PER_DIMENSION - MIN_SCORE_PER_DIMENSION)
        for k, v in scores.items()
    }

    # Determine Holland code from normalized values
    sorted_scores = sorted(
        normalized_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    holland_code = "".join([
        sorted_scores[0][0],
        sorted_scores[1][0],
        sorted_scores[2][0]
    ])

    return normalized_scores, holland_code


def match_careers(scores, career_file="careers.csv"):
    import os

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(BASE_DIR, career_file)

    user_vector = np.array([[scores["R"], scores["I"], scores["A"],
                             scores["S"], scores["E"], scores["C"]]])

    df = pd.read_csv(file_path)

    career_vectors = df[["R", "I", "A", "S", "E", "C"]].values

    similarities = cosine_similarity(user_vector, career_vectors)[0]

    df["match_score"] = similarities

    df_sorted = df.sort_values(by="match_score", ascending=False)

    return df_sorted[["career", "match_score"]].head(5).to_dict(orient="records")

def generate_explanation(scores, holland_code, top_careers):
    
    # Get top 3 traits
    sorted_traits = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    top_traits = [trait[0] for trait in sorted_traits[:3]]

    trait_descriptions = [RIASEC_DESCRIPTIONS[t] for t in top_traits]

    explanation = f"""
Your primary interest areas are {top_traits[0]}, {top_traits[1]}, and {top_traits[2]}.

{trait_descriptions[0]}
{trait_descriptions[1]}
{trait_descriptions[2]}

Based on this profile, careers that align strongly with your personality and interests have been recommended.
"""

    return explanation.strip()
def get_riasec_questions():
    return RIASEC_QUESTIONS