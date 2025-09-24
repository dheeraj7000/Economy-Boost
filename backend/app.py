from flask import Flask, request, jsonify
from flask_cors import CORS
import litellm
from litellm import completion
from pydantic import BaseModel, Field
import os
import requests
import plaid
from plaid.api import plaid_api
import quandl
import fredapi
import json
import nasdaqdatalink
from dotenv import load_dotenv

load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# --- API Keys and Configuration ---
# Set these as environment variables for security in a real application
os.environ["MISTRAL_API_KEY"] = os.getenv("MISTRAL_API_KEY")
os.environ["PLAID_CLIENT_ID"] = os.getenv("PLAID_CLIENT_ID")
os.environ["PLAID_SECRET"] = os.getenv("PLAID_SECRET")
os.environ["QUANDL_API_KEY"] = os.getenv("QUANDL_API_KEY")
os.environ["FRED_API_KEY"] = os.getenv("FRED_API_KEY")

nasdaqdatalink.ApiConfig.api_key = os.environ.get("QUANDL_API_KEY")

# Initialize API clients
PLAID_CLIENT_ID = os.environ.get("PLAID_CLIENT_ID")
PLAID_SECRET = os.environ.get("PLAID_SECRET")
# Plaid API Initialization
configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        "clientId": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
    },
)
api_client = plaid.ApiClient(configuration)
plaid_client_obj = plaid_api.PlaidApi(api_client)

QUANDL_API_KEY = os.environ.get("QUANDL_API_KEY")
quandl.ApiConfig.api_key = QUANDL_API_KEY

FRED_API_KEY = os.environ.get("FRED_API_KEY")
fred = fredapi.Fred(api_key=FRED_API_KEY)


# --- Pydantic Models ---
class LoanEligibility(BaseModel):
    loan_eligibility_score: int = Field(
        ..., description="A score from 1-100 indicating loan eligibility."
    )
    key_risk_factors: list[str] = Field(
        ..., description="List of key risk factors identified in the assessment."
    )
    recommendation: str = Field(
        ..., description="A concise recommendation for the lender."
    )


class FinancialHealth(BaseModel):
    average_monthly_income: float
    average_monthly_expenses: float
    cash_flow_trend: str = Field(
        ..., description="e.g., 'Positive', 'Negative', 'Volatile'"
    )
    debt_to_income_ratio: float
    summary: str


# --- API Endpoints ---
## 1. /api/assess_eligibility (POST)
# Uses LiteLLM and Mistral AI for an AI-powered credit assessment.
@app.route("/api/assess_eligibility", methods=["POST"])
def assess_eligibility():
    data = request.json
    business_description = data.get("business_description", "")
    transaction_data = data.get("transaction_data", "")

    if not business_description or not transaction_data:
        return jsonify({"error": "Missing required data"}), 400

    prompt = f"""
    You are an AI financial analyst. Assess the loan eligibility for a small business based on the following information.
    Business Description: {business_description}
    Transaction Data (e.g., deposits, withdrawals): {transaction_data}
    
    Provide a loan eligibility score (1-100), a list of key risk factors, and a concise recommendation for a lender. The output must be a single JSON object.
    """
    try:
        # Use LiteLLM with a Mistral AI model
        response = completion(
            model="mistral/mistral-small-latest",  # <-- Changed model to a Mistral AI model
            messages=[{"role": "user", "content": prompt}],
        )

        # Extract the content, which is a JSON string, and parse it
        response_content_str = response.choices[0].message.content
        # --- FIX START ---
        # Strip the markdown code block wrapper
        if response_content_str.startswith("```json"):
            response_content_str = response_content_str.replace("```json\n", "", 1)
        if response_content_str.endswith("```"):
            response_content_str = response_content_str.replace("```", "", 1)
        # --- FIX END ---
        parsed_data = json.loads(response_content_str)

        # Validate the parsed data with Pydantic
        loan_eligibility_model = LoanEligibility(**parsed_data)

        # Return the validated model as a JSON response
        return jsonify(loan_eligibility_model.model_dump())

    except json.JSONDecodeError as e:
        # Handle cases where the model's output is not valid JSON
        return (
            jsonify(
                {
                    "error": f"Failed to parse JSON from AI response: {e}",
                    "raw_response": response_content_str,
                }
            ),
            500,
        )
    except Exception as e:
        # Catch any other potential errors
        return jsonify({"error": str(e)}), 500


## 2. /api/get_economic_indicators (GET)
# Uses FRED API to provide macroeconomic data relevant to lenders.
@app.route("/api/get_economic_indicators", methods=["GET"])
def get_economic_indicators():
    try:
        unemployment_data = fred.get_series("UNRATE", start_date="2020-01-01")
        # --- FIX START ---
        # Convert index (Timestamps) to string before converting to dict
        unemployment_json = unemployment_data.to_json()

        cpi_data = fred.get_series("CPIAUCSL", start_date="2025-01-01")
        cpi_json = cpi_data.to_json()

        return jsonify(
            {
                "unemployment_rate": (json.loads(unemployment_json)),
                "consumer_price_index": (json.loads(cpi_json)),
            }
        )
        # --- FIX END ---
    except Exception as e:
        return jsonify({"error": str(e)}), 500


## 3. /api/get_financial_health (POST)
# A mock endpoint that would use Plaid to analyze a user's financial data.
@app.route("/api/get_financial_health", methods=["POST"])
def get_financial_health():
    data = request.json
    mock_transactions = data.get("transactions", [])

    if not mock_transactions:
        return jsonify({"error": "No transaction data provided"}), 400

    deposits = sum(t["amount"] for t in mock_transactions if t["type"] == "deposit")
    withdrawals = sum(
        t["amount"] for t in mock_transactions if t["type"] == "withdrawal"
    )

    avg_income = deposits / (len(mock_transactions) / 10)
    avg_expenses = withdrawals / (len(mock_transactions) / 10)

    if deposits > withdrawals:
        cash_flow = "Positive"
    else:
        cash_flow = "Negative"

    health_info = FinancialHealth(
        average_monthly_income=avg_income,
        average_monthly_expenses=avg_expenses,
        cash_flow_trend=cash_flow,
        debt_to_income_ratio=0.35,  # Mock value
        summary="Based on the provided data, the business has a consistent cash flow but should monitor expenses.",
    )

    return jsonify(health_info.model_dump())


## 4. /api/get_market_data (GET)
# Uses Quandl to provide a sample of global or national market data.
@app.route("/api/get_market_data", methods=["GET"])
def get_market_data():
    try:
        # The QDL/FON dataset is a "table," not a "time-series."
        # It requires the get_table() method, not get().
        # We also need to get a subset of data to avoid rate limits and large payloads.
        data = nasdaqdatalink.get_table("QDL/FON", date={"gte": "2025-01-01"},)

        # The returned data is a Pandas DataFrame. It must be converted to a list of dicts for JSON.
        # to_dict('records') is the most reliable way to do this.
        data_json = data.to_dict("records")

        return jsonify(data_json)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


## 5. /api/get_development_indicators (GET)
# Uses World Bank Open Data to show a country's development progress.
@app.route("/api/get_development_indicators", methods=["GET"])
def get_development_indicators():
    country_code = request.args.get("country", "IND")
    indicator_code = "SP.POP.TOTL"

    url = f"http://api.worldbank.org/v2/country/{country_code}/indicator/{indicator_code}?format=json&date=2015:2020"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        if len(data) > 1 and data[1]:
            return jsonify(
                {
                    "country": data[1][0]["country"]["value"],
                    "indicator": data[1][0]["indicator"]["value"],
                    "data": [
                        {"year": item["date"], "value": item["value"]}
                        for item in data[1]
                        if item["value"] is not None
                    ],
                }
            )
        else:
            return (
                jsonify({"error": "No data found for the given country or indicator."}),
                404,
            )

    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Failed to fetch data from World Bank API: {e}"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
