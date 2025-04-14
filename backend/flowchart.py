
str=input("Enter the topic")
str=str+" flow chart"

import requests
import json
import cv2
import numpy as np
from PIL import Image
from io import BytesIO

# 🔑 Google API Key & CSE ID
API_KEY = "AIzaSyBucdfY9_2iXChsS5zr405NUdtMvNc9RtU"
CX = "821bd1225523b4a80"

# 🔎 Define the search query
search_query = str

# 🌍 Google Search API Endpoint (Fetch 5 images)
URL = f"https://www.googleapis.com/customsearch/v1?q={search_query}&cx={CX}&searchType=image&key={API_KEY}&num=10"

# 📡 Send GET Request to Google API
response = requests.get(URL)
results = response.json()

# 📸 Function to check image sharpness
def is_clear_image(image_url, threshold=100):
    try:
        # Download the image
        image_response = requests.get(image_url, stream=True)
        image = Image.open(BytesIO(image_response.content)).convert("L")  # Convert to grayscale

        # Convert image to numpy array
        image_np = np.array(image)

        # Compute variance of Laplacian (sharpness measure)
        laplacian_var = cv2.Laplacian(image_np, cv2.CV_64F).var()

        return laplacian_var > threshold  # Return True if sharp, False if blurry
    except:
        return False  # In case of an error (invalid image)

# 🔎 Find the first clear image
if "items" in results:
    for item in results["items"]:
        image_url = item["link"]
        if is_clear_image(image_url):
            print(f"{image_url}")
            break  # Stop after finding the first clear image
    else:
        print("No clear images found.")
else:
    print("No images found.")

