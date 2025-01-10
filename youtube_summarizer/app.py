import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel
from youtube_transcript_api import YouTubeTranscriptApi

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Request model
class SummarizeRequest(BaseModel):
    video_id: str
    language_code: str = "en"  # default to English

# Response model
class SummarizeResponse(BaseModel):
    summary: str

# OpenRouter API configuration
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')
OPENROUTER_API_URL = "https://openrouter.ai/api/v1"


client = OpenAI(
  base_url=OPENROUTER_API_URL,
  api_key=OPENROUTER_API_KEY,
)

async def get_youtube_transcript(video_id: str, language_code: str) -> str:
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=[language_code])
        return " ".join([entry['text'] for entry in transcript_list])
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Transcirpt Not Availalbe: {str(e)}")

async def generate_summary(transcript: str) -> str:
    
    # Prepare the prompt for the LLM
    prompt = f"""Please provide a concise summary of the following transcript:

{transcript}

Summary:"""

    completion = client.chat.completions.create(
    model="google/gemini-2.0-flash-exp:free",
    messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
    )
    
    print(completion)
    
    return completion.choices[0].message.content



@app.post("/summarize", response_model=SummarizeResponse)
async def summarize_video(request: SummarizeRequest):
    try:
        
        # Get the transcript
        transcript = await get_youtube_transcript(request.video_id, request.language_code)
        
        print(transcript)

        # Generate summary
        summary = await generate_summary(transcript)
        
        return SummarizeResponse(summary=summary)
    
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)