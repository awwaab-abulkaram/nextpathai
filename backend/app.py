from flask import Flask, request, jsonify
from riasec import calculate_riasec, match_careers, generate_explanation, get_riasec_questions
from academic import calculate_academic_scores, generate_academic_report, ACADEMIC_QUESTIONS
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
    user = users.find_one({"uid": uid})

    if not user or "riasec" not in user:
        return jsonify({"message": "No profile found"}), 404

    return jsonify({
        "riasec": user["riasec"]
    })

@app.route("/academic/submit", methods=["POST"])
def submit_academic():

    data = request.get_json()

    if not data or "responses" not in data:
        return jsonify({"error": "Invalid input"}), 400

    responses = data["responses"]

    # Calculate normalized scores
    normalized_scores = calculate_academic_scores(responses)

    # Generate detailed report
    report = generate_academic_report(normalized_scores)

    return jsonify({
        "status": "success",
        "normalized_scores": normalized_scores,
        "report": report
    })
@app.route("/academic/questions", methods=["GET"])
def get_academic_questions():
    formatted_questions = []

    for subject, questions in ACADEMIC_QUESTIONS.items():
        for q in questions:
            formatted_questions.append({
                "id": q["id"],
                "subject": subject,
                "text": q["text"],
                "options": q["options"]
            })

    return jsonify({
        "status": "success",
        "total_questions": len(formatted_questions),
        "questions": formatted_questions
    })
if __name__ == "__main__":
    app.run(debug=True)