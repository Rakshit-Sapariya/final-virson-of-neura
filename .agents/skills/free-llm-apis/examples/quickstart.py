"""
Quickstart script demonstrating OpenAI SDK compatibility across free LLM providers.
Requires: pip install openai
"""
import os
from openai import OpenAI

# 1. Groq (High speed, 30 RPM, 14.4k RPD free)
def run_groq():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("Skipping Groq (GROQ_API_KEY not set)")
        return
    client = OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")
    resp = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": "Explain quantum computing in one short sentence."}]
    )
    print("Groq response:", resp.choices[0].message.content)

# 2. Google Gemini (1M context free tier via AI Studio)
def run_gemini():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Skipping Gemini (GEMINI_API_KEY not set)")
        return
    client = OpenAI(api_key=api_key, base_url="https://generativelanguage.googleapis.com/v1beta/openai/")
    resp = client.chat.completions.create(
        model="gemini-2.5-flash",
        messages=[{"role": "user", "content": "Write a haiku about programming."}]
    )
    print("Gemini response:", resp.choices[0].message.content)

# 3. OpenRouter Free Router
def run_openrouter():
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        print("Skipping OpenRouter (OPENROUTER_API_KEY not set)")
        return
    client = OpenAI(api_key=api_key, base_url="https://openrouter.ai/api/v1")
    resp = client.chat.completions.create(
        model="meta-llama/llama-3.3-70b-instruct:free",
        messages=[{"role": "user", "content": "Give me a pro tip for software engineering."}]
    )
    print("OpenRouter response:", resp.choices[0].message.content)

if __name__ == "__main__":
    print("=== Testing Free LLM APIs ===")
    run_groq()
    run_gemini()
    run_openrouter()
