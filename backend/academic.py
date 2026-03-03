ACADEMIC_QUESTIONS = {
    "Physics": [
        {"id": "p1", "text": "What is the SI unit of force?", "options": ["Joule", "Newton", "Pascal", "Watt"], "answer": "Newton"},
        {"id": "p2", "text": "What is the formula for acceleration?", "options": ["v × t", "v / t", "(v − u) / t", "u + at"], "answer": "(v − u) / t"},
        {"id": "p3", "text": "Who gave the three laws of motion?", "options": ["Einstein", "Galileo", "Newton", "Bohr"], "answer": "Newton"},
        {"id": "p4", "text": "Value of acceleration due to gravity?", "options": ["8.9", "9.8", "10.8", "9.0"], "answer": "9.8"},
        {"id": "p5", "text": "SI unit of electric current?", "options": ["Volt", "Watt", "Ampere", "Coulomb"], "answer": "Ampere"},
        {"id": "p6", "text": "Ohm’s Law states V = ?", "options": ["I/R", "IR", "R/I", "I²R"], "answer": "IR"},
        {"id": "p7", "text": "Rate of doing work is called?", "options": ["Energy", "Power", "Force", "Pressure"], "answer": "Power"},
        {"id": "p8", "text": "Lens used to correct myopia?", "options": ["Convex", "Concave", "Cylindrical", "Plane"], "answer": "Concave"},
        {"id": "p9", "text": "Energy conversion in electric bulb?", "options": ["Mechanical→Electrical", "Electrical→Heat & Light", "Light→Electrical", "Chemical→Electrical"], "answer": "Electrical→Heat & Light"},
        {"id": "p10", "text": "Mirror used in rear-view mirrors?", "options": ["Plane", "Convex", "Concave", "Cylindrical"], "answer": "Convex"},
    ],

    "Chemistry": [
        {"id": "c11", "text": "Valency of oxygen?", "options": ["1", "2", "3", "4"], "answer": "2"},
        {"id": "c12", "text": "Chemical formula of water?", "options": ["HO", "H2O", "H2O2", "OH2"], "answer": "H2O"},
        {"id": "c13", "text": "Atomic number of carbon?", "options": ["6", "12", "14", "8"], "answer": "6"},
        {"id": "c14", "text": "Who proposed atomic theory?", "options": ["Rutherford", "Dalton", "Thomson", "Bohr"], "answer": "Dalton"},
        {"id": "c15", "text": "pH < 7 indicates?", "options": ["Base", "Acid", "Neutral", "Salt"], "answer": "Acid"},
        {"id": "c16", "text": "Gas released in photosynthesis?", "options": ["CO2", "Nitrogen", "Oxygen", "Hydrogen"], "answer": "Oxygen"},
        {"id": "c17", "text": "Zn + CuSO4 reaction type?", "options": ["Combination", "Decomposition", "Displacement", "Neutralization"], "answer": "Displacement"},
        {"id": "c18", "text": "Formula of methane?", "options": ["CH4", "C2H6", "CO2", "C2H4"], "answer": "CH4"},
        {"id": "c19", "text": "Max electrons in outer shell?", "options": ["2", "4", "8", "18"], "answer": "8"},
        {"id": "c20", "text": "Common name of sodium bicarbonate?", "options": ["Washing soda", "Baking soda", "Bleaching powder", "Caustic soda"], "answer": "Baking soda"},
    ],

    "Biology": [
        {"id": "b1", "text": "Father of Genetics?", "options": ["Darwin", "Mendel", "Pasteur", "Watson"], "answer": "Mendel"},
        {"id": "b2", "text": "Basic unit of life?", "options": ["Tissue", "Organ", "Cell", "System"], "answer": "Cell"},
        {"id": "b3", "text": "Powerhouse of cell?", "options": ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"], "answer": "Mitochondria"},
        {"id": "b4", "text": "Photosynthesis occurs in?", "options": ["Mitochondria", "Chloroplast", "Vacuole", "Cytoplasm"], "answer": "Chloroplast"},
        {"id": "b5", "text": "Function of RBC?", "options": ["Fight infection", "Carry oxygen", "Clot blood", "Hormone production"], "answer": "Carry oxygen"},
        {"id": "b6", "text": "Brain part for balance?", "options": ["Cerebrum", "Cerebellum", "Medulla", "Hypothalamus"], "answer": "Cerebellum"},
        {"id": "b7", "text": "Loss of water from plants?", "options": ["Respiration", "Transpiration", "Digestion", "Excretion"], "answer": "Transpiration"},
        {"id": "b8", "text": "Heart chambers?", "options": ["2", "3", "4", "5"], "answer": "4"},
        {"id": "b9", "text": "DNA stands for?", "options": ["Deoxyribo Nucleic Acid", "Deoxyribonucleic Acid", "Dioxyribonucleic Acid", "Dynamic Nucleic Acid"], "answer": "Deoxyribonucleic Acid"},
        {"id": "b10", "text": "Male part of flower?", "options": ["Pistil", "Ovule", "Stamen", "Sepal"], "answer": "Stamen"},
    ]
}
def calculate_academic_scores(responses):
    """
    responses = {
        "p1": "Newton",
        "c11": "2",
        "b1": "Mendel",
        ...
    }
    """

    scores = {
        "Physics": 0,
        "Chemistry": 0,
        "Biology": 0
    }

    max_scores = {
        "Physics": len(ACADEMIC_QUESTIONS["Physics"]),
        "Chemistry": len(ACADEMIC_QUESTIONS["Chemistry"]),
        "Biology": len(ACADEMIC_QUESTIONS["Biology"])
    }

    for subject, questions in ACADEMIC_QUESTIONS.items():
        for q in questions:
            qid = q["id"]
            if qid in responses and responses[qid] == q["answer"]:
                scores[subject] += 1

    # Normalize (0–1 scale)
    normalized_scores = {
        subject: scores[subject] / max_scores[subject]
        for subject in scores
    }

    return normalized_scores
def academic_level(score):
    if score >= 0.8:
        return "Strong"
    elif score >= 0.5:
        return "Moderate"
    else:
        return "Needs Improvement"
    
def generate_academic_report(scores):

    report = {}

    for subject, score in scores.items():
        report[subject] = {
            "score": round(score, 2),
            "level": academic_level(score)
        }

    return report