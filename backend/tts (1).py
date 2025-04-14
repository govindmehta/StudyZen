
from fastapi import FastAPI
from pydantic import BaseModel
import requests

# Initialize FastAPI app
app = FastAPI()

# 🔑 Replace with your YouTube API Key
YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY"

# Request model
class TopicRequest(BaseModel):
    topic: str

def get_top_youtube_videos(topic: str):
    """
    Fetches the top 5 YouTube videos related to a given topic.
    """
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": topic,
        "type": "video",
        "maxResults": 5,
        "key": YOUTUBE_API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    videos = []
    for item in data.get("items", []):
        video_id = item["id"]["videoId"]
        link = f"https://www.youtube.com/watch?v={video_id}"
        videos.append(link)

    return videos

@app.post("/get_videos/")
def fetch_videos(request: TopicRequest):
    """
    API endpoint to fetch top 5 YouTube videos based on topic.
    """
    video_links = get_top_youtube_videos(request.topic)
    return {"video_links": video_links}

import requests

url = "http://127.0.0.1:8000/get_videos/"
data = {"topic": "machine learning"}

response = requests.post(url, json=data)
print(response.json())  # Returns {"video_links": ["link1", "link2", ...]}