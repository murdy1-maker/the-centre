import os
import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydantic_ai import Agent

from schemas import (
    SourceArticle,
    ExtractedClaim,
    MappedConflict,
    SynthesisResult,
    AnalysisTask
)
from prompts import (
    EXTRACTION_PROMPT,
    VERIFICATION_PROMPT,
    SYNTHESIS_PROMPT
)

app = FastAPI(
    title="THE CENTRE - Analysis Engine",
    description="Automated multi-perspective search and synthesis pipeline.",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SEARCH_INGESTION_PROMPT = """
Role: You are the Source Retrieval and Ingestion Agent.
Your task: Given a user query on any news, political, scientific, or social topic, identify and structure 3 to 5 distinct perspective sources representing:
- CONSENSUS (mainstream institutional or official standard view)
- CONTRARIAN (credible opposing, dissenting, or counter-establishment view)
- SKEPTIC or PRO_ESTABLISHMENT or NEUTRAL_PRIMARY (independent data, regulatory filings, or scientific baseline)

For each source, extract or summarize the authentic core reporting/text, identify the publisher, assign the appropriate perspective tag, and provide a valid URL.
"""

# Agents
source_agent = Agent(
    'google-gla:gemini-2.5-pro',
    system_prompt=SEARCH_INGESTION_PROMPT,
    result_type=List[SourceArticle]
)

extraction_agent = Agent(
    'google-gla:gemini-2.5-pro',
    system_prompt=EXTRACTION_PROMPT,
    result_type=List[ExtractedClaim]
)

verification_agent = Agent(
    'google-gla:gemini-2.5-pro',
    system_prompt=VERIFICATION_PROMPT,
    result_type=List[MappedConflict]
)

synthesis_agent = Agent(
    'google-gla:gemini-2.5-pro',
    system_prompt=SYNTHESIS_PROMPT,
    result_type=SynthesisResult
)

class AnalyzePayload(BaseModel):
    query: str
    sources: Optional[List[SourceArticle]] = None

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "THE CENTRE - Analysis Engine", "version": "1.1.0"}

@app.post("/v1/analyze", response_model=AnalysisTask)
async def generate_central_analysis(payload: AnalyzePayload):
    try:
        query = payload.query
        sources = payload.sources

        # Step 0: Automated Multi-Perspective Search Ingestion if sources not provided
        if not sources or len(sources) == 0:
            ingested_res = await source_agent.run(
                f"Perform research across diverse perspectives for topic: '{query}'. Find 3 to 5 contrasting sources."
            )
            sources = ingested_res.data

        # Step 1: Extraction (Broaden & Strip Rhetoric)
        extracted_data = await extraction_agent.run(f"Extract claims from: {sources}")

        # Step 2: Verification (Test & Map Conflicts)
        mapped_data = await verification_agent.run(f"Map conflicts in: {extracted_data.data}")

        # Step 3: Synthesis (Synthesize Central Analysis)
        final_result = await synthesis_agent.run(f"Synthesize this map for query '{query}': {mapped_data.data}")

        return AnalysisTask(
            task_id=str(uuid.uuid4()),
            user_query=query,
            sources_ingested=sources,
            extracted_claims=extracted_data.data,
            mapped_conflicts=mapped_data.data,
            final_synthesis=final_result.data,
            status="COMPLETE"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

