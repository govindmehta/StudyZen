import google.generativeai as genai

genai.configure(api_key="YOUR_GEMINI_API_KEY")

def classify_text(text):
    model = genai.GenerativeModel("gemini-2.0-flash")
    prompt = f"""Classify the following text into one of these categories:
    1. Computer Science
    2. Mathematics
    3. Physics
    4. History
    5. Other

    Text: '{text}', prob score
    
    Just return the scores."""
    
    response = model.generate_content(prompt)
    return response.text.strip()

# Example usage
def query(text):
    return classify_text(text)
