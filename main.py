import uuid
from typing import List
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
    description="Backend API powering The Centre analysis pipeline for balanced perspective synthesis.",
    version="1.0.0"
)

# Enable CORS for mobile application clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM Agents with strict Pydantic output parsing
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
    sources: List[SourceArticle]

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "THE CENTRE - Analysis Engine"}

@app.post("/v1/analyze", response_model=AnalysisTask)
async def generate_central_analysis(payload: AnalyzePayload):
    try:
        query = payload.query
        sources = payload.sources

        # Step 1: Extraction (Broaden)
        extracted_data = await extraction_agent.run(f"Extract claims from: {sources}")
        
        # Step 2: Verification (Test)
        mapped_data = await verification_agent.run(f"Map conflicts in: {extracted_data.data}")
        
        # Step 3: Synthesis (Synthesize)
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
