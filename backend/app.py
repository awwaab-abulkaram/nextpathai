from flask import Flask, request, jsonify
from riasec import calculate_riasec, match_careers, generate_explanation, get_riasec_questions
from academic import calculate_academic_scores, generate_academic_report, load_academic_questions, recommend_stream
from aptitude import generate_aptitude_report, calculate_aptitude_scores, sanitize_questions, select_aptitude_questions
from academic_maths import load_math_questions, calculate_math_scores, generate_math_report, recommend_math_path
from academic_social import load_social_questions, generate_social_report, calculate_social_scores, recommend_social_path
from flask_cors import CORS
from flask import request, jsonify
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)
@app.route("/riasec", methods=["POST"])
def riasec_route():
    try:
        data = request.get_json()

        if not data or "responses" not in data:
            return jsonify({"error": "Invalid input"}), 400

        responses = data["responses"]

        scores, holland_code = calculate_riasec(responses)
        top_careers = match_careers(scores)
        explanation = generate_explanation(scores, holland_code, top_careers)

        return jsonify({
            "scores": scores,
            "holland_code": holland_code,
            "top_careers": top_careers,
            "explanation": explanation
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/riasec/questions", methods=["GET"])
def get_questions():
    questions = get_riasec_questions()
    return jsonify(questions)

client = MongoClient("mongodb://localhost:27017/")
db = client["career_guidance"]
users = db["users"]

@app.route("/profile/save-riasec", methods=["POST"])
def save_riasec():
    data = request.json
    uid = data.get("uid")
    riasec = data.get("riasec")

    if not uid or not riasec:
        return jsonify({"error": "Missing data"}), 400

    users.update_one(
        {"uid": uid},
        {"$set": {"riasec": riasec}},
        upsert=True
    )

    return jsonify({"message": "Saved successfully"})

@app.route("/profile/<uid>", methods=["GET"])
def get_profile(uid):

    user = users.find_one({"uid": uid}, {"_id": 0})  # hide Mongo _id

    if not user:
        return jsonify({"message": "No profile found"}), 404

    return jsonify(user)

@app.route("/academic/submit", methods=["POST"])
def submit_academic():

    data = request.get_json()

    if not data or "responses" not in data or "uid" not in data:
        return jsonify({"error": "Invalid input"}), 400

    uid = data["uid"]
    responses = data["responses"]

    # -------- CALCULATE SCORES --------
    scores = calculate_academic_scores(responses)

    report = generate_academic_report(scores)

    recommendation = recommend_stream(scores)

    result = {
        "normalized_scores": scores,
        "report": report,
        "recommendation": recommendation
    }

    # -------- SAVE RESULT TO MONGO --------
    users.update_one(
        {"uid": uid},
        {
            "$set": {
                "academic.overall": result
            }
        },
        upsert=True
    )

    # -------- RETURN RESULT --------
    return jsonify({
        "status": "success",
        **result
    })

@app.route("/academic/questions", methods=["GET"])
def get_academic_questions():

    questions = load_academic_questions()

    return jsonify({
        "status": "success",
        "total_questions": len(questions),
        "questions": questions
    })
current_test = []

@app.route("/aptitude/questions", methods=["GET"])
def get_aptitude_questions():

    global current_test

    current_test = select_aptitude_questions()

    return jsonify(sanitize_questions(current_test))


@app.route("/aptitude/submit", methods=["POST"])
def submit_aptitude():

    data = request.json
    answers = data["answers"]

    scores = calculate_aptitude_scores(answers, current_test)

    report = generate_aptitude_report(scores)

    return jsonify(report)

@app.route("/math/questions", methods=["GET"])
def get_math_questions():

    questions = load_math_questions()

    return jsonify({
        "status": "success",
        "total_questions": len(questions),
        "questions": questions
    })

@app.route("/math/submit", methods=["POST"])
def submit_math_quiz():

    data = request.get_json()

    if not data or "responses" not in data or "uid" not in data:
        return jsonify({"error": "Invalid input"}), 400

    uid = data["uid"]
    responses = data["responses"]

    # ---------- CALCULATE SCORES ----------
    scores = calculate_math_scores(responses)

    report = generate_math_report(scores)

    recommendation = recommend_math_path(scores)

    result = {
        "normalized_scores": scores,
        "report": report,
        "recommendation": recommendation
    }

    # ---------- SAVE RESULT TO MONGO ----------
    users.update_one(
        {"uid": uid},
        {
            "$set": {
                "academic.maths": result
            }
        },
        upsert=True
    )

    # ---------- RETURN RESULT ----------
    return jsonify({
        "status": "success",
        **result
    })

@app.route("/social/questions", methods=["GET"])
def get_social_questions():

    questions = load_social_questions()

    return jsonify({
        "status": "success",
        "total_questions": len(questions),
        "questions": questions
    })

@app.route("/social/submit", methods=["POST"])
def submit_social_quiz():

    data = request.get_json()

    if not data or "responses" not in data or "uid" not in data:
        return jsonify({"error": "Invalid input"}), 400

    uid = data["uid"]
    responses = data["responses"]

    # -------- CALCULATE RESULTS --------
    scores = calculate_social_scores(responses)

    report = generate_social_report(scores)

    recommendation = recommend_social_path(scores)

    result = {
        "normalized_scores": scores,
        "report": report,
        "recommendation": recommendation
    }

    # -------- SAVE RESULT TO MONGO --------
    users.update_one(
        {"uid": uid},
        {
            "$set": {
                "academic.social": result
            }
        },
        upsert=True
    )

    # -------- RETURN RESULT --------
    return jsonify({
        "status": "success",
        **result
    })
@app.route("/profile/save-aptitude", methods=["POST"])
def save_aptitude():

    data = request.json
    uid = data.get("uid")
    result = data.get("result")

    if not uid or not result:
        return jsonify({"error": "uid and result required"}), 400

    users.update_one(
        {"uid": uid},                 # find user document
        {
            "$set": {
                "aptitude": result    # add/update aptitude field
            }
        },
        upsert=True                   # create if not exists
    )

    return jsonify({
        "message": "Aptitude saved successfully"
    })

if __name__ == "__main__":
    app.run(debug=True)