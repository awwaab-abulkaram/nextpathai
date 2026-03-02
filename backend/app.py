from flask import Flask, request, jsonify
from riasec import calculate_riasec, match_careers, generate_explanation, get_riasec_questions
from flask_cors import CORS

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

if __name__ == "__main__":
    app.run(debug=True)