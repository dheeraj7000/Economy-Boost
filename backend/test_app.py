import requests
import json
import time

# Base URL of the running Flask app
BASE_URL = "http://127.0.0.1:5000/api"

def print_test_status(test_name, success, response_text):
    """A helper function to print the test result clearly."""
    status = "SUCCESS" if success else "FAILURE"
    print("-" * 50)
    print(f"[{status}] Testing {test_name}")
    print(f"Response: {response_text}")
    print("-" * 50 + "\n")

def test_assess_eligibility():
    """Tests the /assess_eligibility endpoint with dummy data."""
    test_name = "Loan Eligibility Assessment"
    data = {
        "business_description": "A small family-owned bakery that sells bread and pastries in a local community. It has a loyal customer base and has been operating for 2 years.",
        "transaction_data": "Deposits: $200, $350, $150, $400. Withdrawals: $100, $50, $250. Average weekly revenue: $300."
    }
    try:
        response = requests.post(f"{BASE_URL}/assess_eligibility", json=data)
        response_data = response.json()
        success = response.status_code == 200 and "loan_eligibility_score" in response_data
        print_test_status(test_name, success, json.dumps(response_data, indent=2))
    except requests.exceptions.RequestException as e:
        print_test_status(test_name, False, f"Request failed: {e}")

def test_get_economic_indicators():
    """Tests the /get_economic_indicators endpoint."""
    test_name = "Economic Indicators"
    try:
        response = requests.get(f"{BASE_URL}/get_economic_indicators")
        response_data = response.json()
        success = response.status_code == 200 and "unemployment_rate" in response_data
        print_test_status(test_name, success, json.dumps(response_data, indent=2))
    except requests.exceptions.RequestException as e:
        print_test_status(test_name, False, f"Request failed: {e}")

def test_get_financial_health():
    """Tests the /get_financial_health endpoint with mock transaction data."""
    test_name = "Financial Health Analysis"
    data = {
        "transactions": [
            {"amount": 500, "type": "deposit"},
            {"amount": 100, "type": "withdrawal"},
            {"amount": 750, "type": "deposit"},
            {"amount": 250, "type": "withdrawal"},
            {"amount": 300, "type": "deposit"}
        ]
    }
    try:
        response = requests.post(f"{BASE_URL}/get_financial_health", json=data)
        response_data = response.json()
        success = response.status_code == 200 and "cash_flow_trend" in response_data
        print_test_status(test_name, success, json.dumps(response_data, indent=2))
    except requests.exceptions.RequestException as e:
        print_test_status(test_name, False, f"Request failed: {e}")

def test_get_market_data():
    """Tests the /get_market_data endpoint."""
    test_name = "Market Data Fetch"
    try:
        response = requests.get(f"{BASE_URL}/get_market_data")
        response_data = response.json()
        success = response.status_code == 200
        print_test_status(test_name, success, json.dumps(response_data, indent=2))
    except requests.exceptions.RequestException as e:
        print_test_status(test_name, False, f"Request failed: {e}")

def test_get_development_indicators():
    """Tests the /get_development_indicators endpoint for a specific country."""
    test_name = "Development Indicators"
    try:
        response = requests.get(f"{BASE_URL}/get_development_indicators?country=BRA")
        response_data = response.json()
        success = response.status_code == 200 and "country" in response_data and response_data["country"] == "Brazil"
        print_test_status(test_name, success, json.dumps(response_data, indent=2))
    except requests.exceptions.RequestException as e:
        print_test_status(test_name, False, f"Request failed: {e}")

if __name__ == "__main__":
    print("Starting API tests for EconoRise backend...")
    print("Please ensure your Flask app is running on a separate terminal.")
    time.sleep(2)
    test_assess_eligibility()
    test_get_economic_indicators()
    test_get_financial_health()
    test_get_market_data()
    test_get_development_indicators()
    print("All tests completed.")