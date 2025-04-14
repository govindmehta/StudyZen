# Import required libraries
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel, Field,model_validator
from typing import List, Dict, Optional
from fastapi import FastAPI, HTTPException
import os
from langchain.schema.runnable import RunnableParallel
from time_table import *
from quiz import *
from content import *
from langchain_core.output_parsers import PydanticOutputParser
from dotenv import load_dotenv
import uvicorn
import requests
import cv2
import numpy as np
from PIL import Image
from io import BytesIO
from fastapi.middleware.cors import CORSMiddleware
# Load environment variables
load_dotenv()

API_KEY = "AIzaSyBucdfY9_2iXChsS5zr405NUdtMvNc9RtU"
CX = "821bd1225523b4a80"

# Initialize FastAPI
app = FastAPI(title="Study Buddy API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

model= ChatGoogleGenerativeAI(model="gemini-2.0-flash")
# model= ChatGroq(model="llama-3.3-70b-versatile")

schedule_chain= schedule_prompt | model
quiz_chain= quiz_prompt | model
content_chain= content_prompt | model


@app.post("/generate_schedule/")
async def generate_schedule(topic: str):
    result = schedule_chain.invoke({"topic": topic})
    output = parser.parse(result.content)
    return {
        "subtopics": output.subtopics,
        "day": output.day,
        "resources": output.resources
    }

@app.post("/explaination/")
async def explaination(subtopic: str):    
    result = content_chain.invoke({"subtopic": subtopic})
    output = parser.parse(result.content)
    print(output)
    return {
        "content": output.content,
        "examples": output.examples,
        "analogies": output.analogies,
        "code_example": output.code_example,
        "keywords": output.keywords,
        "summary": output.summary
    }
# @app.post("/quiz/")
# async def quizz(subtopic: str):    
#     result = quiz_chain.invoke({"subtopic": subtopic})
#     output = parser.parse(result.content)
#     print(output)
#     return {
#         "ques": output.ques,
#         "ans": output.ans,
#         "options": output.options
#     }

# flowchart 
def is_clear_image(image_url, threshold=100):
    try:
        image_response = requests.get(image_url, stream=True, timeout=5)
        image = Image.open(BytesIO(image_response.content)).convert("L")
        laplacian_var = cv2.Laplacian(np.array(image), cv2.CV_64F).var()
        return laplacian_var > threshold
    except:
        return False

@app.post("/flowchart/")
async def search_flowchart(subtopic: str):
    query = f"{subtopic} flow chart"
    url = f"https://www.googleapis.com/customsearch/v1?q={query}&cx={CX}&searchType=image&key={API_KEY}&num=10"
    
    response = requests.get(url)
    results = response.json()

    if "items" in results:
        for item in results["items"]:
            if is_clear_image(item["link"]):
                return {"image_url": item["link"]}
    
    return {"error": "No clear images found."}

YOUTUBE_API_KEY = "AIzaSyAcCgwuy8HNoM51Tlf6Z4muoRVj9OW_7qE"

class TopicRequest(BaseModel):
    topic: str

@app.post("/videos/")
def videos(topic: str):
    topic=f"{topic}"
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {"part": "snippet", "q": topic, "type": "video", "maxResults": 5, "key": YOUTUBE_API_KEY}
    response = requests.get(url, params=params).json()
    return {"video_links": [f"https://www.youtube.com/watch?v={item['id']['videoId']}" for item in response.get("items", [])]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)