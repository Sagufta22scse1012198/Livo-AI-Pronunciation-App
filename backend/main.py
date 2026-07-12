from difflib import SequenceMatcher
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import whisper
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = whisper.load_model("base")

expected_text = (
    "Hello everyone, my name is Sagufta. I recently completed my BTech in Computer Science and Engineering from Galgotias University."
)

@app.get("/")
def home():
    return {"message": "Livo AI Backend is Running!"}


@app.post("/upload")
async def upload_audio(audio: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)

    file_path = f"uploads/{audio.filename}"

    with open(file_path, "wb") as buffer:
        buffer.write(await audio.read())

    # Transcribe audio
    result = model.transcribe(file_path)
    spoken_text = result["text"]

    # Calculate accuracy
    accuracy = round(
        SequenceMatcher(
            None,
            expected_text.lower(),
            spoken_text.lower()
        ).ratio() * 100,
        2
    )

    if accuracy >= 90:
       feedback = "Excellent pronunciation."
    elif accuracy >= 75:
       feedback = "Good pronunciation. Practice the highlighted words."
    elif accuracy >= 50:
       feedback = "Average pronunciation. Improve clarity."
    else:
       feedback = "Needs significant improvement."

    # Find incorrect words
   

    expected_words = expected_text.split()
    spoken_words = spoken_text.split()

    matcher = SequenceMatcher(None, expected_words, spoken_words)

    mistakes = []

    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag != "equal":
            mistakes.append({
               "expected": " ".join(expected_words[i1:i2]),
               "spoken": " ".join(spoken_words[j1:j2])
        })

    return {
        "filename": audio.filename,
        "transcription": spoken_text,
        "score": accuracy,
        "expected": expected_text,
        "mistakes": mistakes,
        "feedback": feedback
    }
    if os.path.exists(file_path):
       os.remove(file_path)