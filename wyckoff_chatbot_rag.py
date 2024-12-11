from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import openai
import pandas as pd
import numpy as np
import os

# Load environment variables from .env
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

class WyckoffChatbot:
    def __init__(self):
        
        openai.api_key = os.getenv("OPENAI_API_KEY")
        if not openai.api_key:
            raise ValueError("OPENAI_API_KEY is not set in the environment.")
        self.qa_pairs = []

    def load_data_from_csv(self, csv_path):
        # Load CSV data with robust encoding handling
        encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252']
        for encoding in encodings:
            try:
                print(f"Trying to load data with {encoding} encoding...")
                df = pd.read_csv(csv_path, encoding=encoding)
                if "Question" not in df.columns or "Answer" not in df.columns:
                    raise ValueError("CSV must contain 'Question' and 'Answer' columns.")
                self.qa_pairs = list(zip(df['Question'].tolist(), df['Answer'].tolist()))
                print(f"Successfully loaded {len(self.qa_pairs)} Q&A pairs using {encoding} encoding.")
                return
            except (UnicodeDecodeError, ValueError) as e:
                print(f"Failed with {encoding}: {e}")
        raise ValueError("Failed to load CSV with any compatible encoding.")

    def get_relevant_context(self, query, k=3):
       
        similarities = [self._calculate_text_similarity(query, q) for q, _ in self.qa_pairs]
        top_k_idx = np.argsort(similarities)[-k:][::-1]
        context = "".join([f"Q: {self.qa_pairs[i][0]}\nA: {self.qa_pairs[i][1]}\n\n" for i in top_k_idx])
        return context

    def _calculate_text_similarity(self, text1, text2):
   
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        return len(words1 & words2) / len(words1 | words2)

    def generate_response(self, query):
        try:
            print("Generating context...")
            context = self.get_relevant_context(query)
            print(f"Context: {context}")

    
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo", 
                messages=[
                    {"role": "system", "content": "You are a helpful assistant knowledgeable about Wyckoff trading."},
                    {"role": "user", "content": f"Using the following Wyckoff trading knowledge as context:\n\n{context}\n\n{query}"}
                ],
                max_tokens=200,
                temperature=0.7,
                top_p=0.9
            )
            return response['choices'][0]['message']['content'].strip()
        except Exception as e:
            print(f"Error in generate_response: {e}")
            raise

# Initialize chatbot
chatbot = WyckoffChatbot()
try:
    chatbot.load_data_from_csv("Wyckoff_qa.csv")
except Exception as e:
    print(f"Error loading data: {e}")

# Define API request model
class Query(BaseModel):
    query: str


@app.post("/generate-response/")
async def generate_response(query: Query):
    try:
        print(f"Received query: {query.query}")
        response = chatbot.generate_response(query.query)
        print(f"Generated response: {response}")
        return {"response": response}
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@app.get("/")
async def health_check():
    return {"status": "ok"}
