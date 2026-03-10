import numpy as np


def recommend_stream(user):

    # ---------- SAFE ACCESS ----------

    academic = user.get("academic", {})
    riasec = user.get("riasec", {}).get("scores", {})
    aptitude = user.get("aptitude", {}).get("scores", {})

    # ---------- ACADEMIC ----------

    math_scores = academic.get("maths", {}).get("normalized_scores", {})
    social_scores = academic.get("social", {}).get("normalized_scores", {})
    science_scores = academic.get("overall", {}).get("normalized_scores", {})

    math = np.mean(list(math_scores.values())) if math_scores else 0
    social = np.mean(list(social_scores.values())) if social_scores else 0
    science = np.mean(list(science_scores.values())) if science_scores else 0

    physics = science_scores.get("Physics", 0)
    chemistry = science_scores.get("Chemistry", 0)
    biology = science_scores.get("Biology", 0)

    # ---------- RIASEC ----------

    R = riasec.get("R", 0)
    I = riasec.get("I", 0)
    A = riasec.get("A", 0)
    S = riasec.get("S", 0)
    E = riasec.get("E", 0)
    C = riasec.get("C", 0)

    # ---------- APTITUDE ----------

    logical = aptitude.get("Logical Reasoning", 0)
    quant = aptitude.get("Quantitative Aptitude", 0)
    verbal = aptitude.get("Verbal Reasoning", 0)

    # ---------- STREAM SCORING ----------

    stream_scores = {

        "Engineering":
            0.6 * math +
            0.3 * physics +
            0.1 * logical,

        "Medical":
            0.6 * biology +
            0.3 * chemistry +
            0.1 * I,

        "Commerce":
            0.5 * social +
            0.3 * math +
            0.2 * E,

        "Arts":
            0.7 * social +
            0.2 * A +
            0.1 * S,

        "Management":
            0.4 * social +
            0.3 * E +
            0.3 * verbal,

        "Law":
            0.6 * social +
            0.2 * verbal +
            0.2 * E,

        "Science":
            0.5 * science +
            0.3 * I +
            0.2 * R
    }

    # ---------- RANK STREAMS ----------

    ranked_streams = sorted(
        stream_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    return ranked_streams[:3]