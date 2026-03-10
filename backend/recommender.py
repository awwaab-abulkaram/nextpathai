import pandas as pd
import numpy as np

# ---------- LOAD DATASET ----------

college_df = pd.read_csv("College_data.csv")

numeric_cols = ["Rating", "Academic", "Faculty", "Placement"]

college_df[numeric_cols] = college_df[numeric_cols].apply(
    pd.to_numeric, errors="coerce"
)

college_df = college_df.dropna(subset=numeric_cols)


# ---------- COLLEGE RECOMMENDATION ----------

def recommend_colleges(user, stream):

    academic = user.get("academic", {})

    # ---------- SAFE ACADEMIC SCORES ----------

    math_scores = academic.get("maths", {}).get("normalized_scores", {})
    social_scores = academic.get("social", {}).get("normalized_scores", {})
    science_scores = academic.get("overall", {}).get("normalized_scores", {})

    math = np.mean(list(math_scores.values())) if math_scores else 0
    social = np.mean(list(social_scores.values())) if social_scores else 0
    science = np.mean(list(science_scores.values())) if science_scores else 0

    # ---------- STUDENT STRENGTH ----------

    student_score = (0.4 * math) + (0.3 * science) + (0.3 * social)

    # ---------- FILTER COLLEGES ----------

    colleges = college_df[college_df["Stream"] == stream].copy()

    if colleges.empty:
        return []

    # ---------- COLLEGE QUALITY ----------

    colleges["college_score"] = (
        0.4 * colleges["Rating"] +
        0.2 * colleges["Academic"] +
        0.2 * colleges["Faculty"] +
        0.2 * colleges["Placement"]
    )

    colleges["college_score"] = colleges["college_score"] / 10

    # ---------- MATCH SCORE ----------

    colleges["match_score"] = student_score / colleges["college_score"]

    colleges["distance"] = abs(colleges["match_score"] - 1)

    colleges = colleges.sort_values("distance")

    # ---------- TOP COLLEGES ----------

    recommendations = []

    for rank, (_, row) in enumerate(colleges.head(3).iterrows(), start=1):

        recommendations.append({
            "rank": rank,
            "college_name": row["College_Name"],
            "state": row.get("State", "Unknown"),
            "rating": float(row["Rating"]),
            "placement_score": float(row["Placement"]),
            "admission_fit": round(float(row["match_score"]), 2)
        })

    return recommendations