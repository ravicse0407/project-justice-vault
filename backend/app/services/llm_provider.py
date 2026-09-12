import os
import json
import httpx
from typing import Optional, Dict, Any, List
from ..config import settings

class LLMProvider:
    """
    Pluggable AI provider:
    - If OPENAI_API_KEY is configured and valid, calls OpenAI GPT-4o-mini with grounded context.
    - If OPENAI_API_KEY is absent or in demo mode, delegates directly to the Deterministic Local Grounding Engine.
    - Never throws raw exceptions; falls back transparently.
    """
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.is_enabled = bool(self.api_key and len(self.api_key) > 10 and not self.api_key.startswith("your_"))

    async def generate_grounded_response(
        self,
        prompt: str,
        context_docs: List[Dict[str, Any]]
    ) -> Optional[str]:
        if not self.is_enabled:
            return None

        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            system_msg = (
                "You are Justice Vault, an evidence-grounded public-service intelligence layer for citizens. "
                "CRITICAL PRINCIPLE: 'No verified evidence -> no confident answer.' "
                "Base your response ONLY on the provided official documents. Never hallucinate facts, deadlines, or fees. "
                "If information is missing, state it explicitly."
            )
            context_str = "\n\n".join([
                f"Document: {d['title']} (ID: {d['id']}, Version: {d['version']}, Issuer: {d['issuer']})\n"
                f"Section: {d['section_title']}\n"
                f"Text: {d['text']}"
                for d in context_docs
            ])
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system_msg},
                    {"role": "user", "content": f"Official Evidence Context:\n{context_str}\n\nCitizen Query: {prompt}"}
                ],
                "temperature": 0.1,
                "max_tokens": 500
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"LLM Provider fallback triggered: {e}")
            return None

        return None

llm_provider = LLMProvider()
