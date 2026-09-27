from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Literal
from datetime import datetime

class SourceArticle(BaseModel):
    id: str
    url: HttpUrl
    publisher: str
    perspective: Literal["CONSENSUS", "CONTRARIAN", "PRO_ESTABLISHMENT", "SKEPTIC", "NEUTRAL_PRIMARY"] 
    publication_date: datetime
    raw_text: str

class ExtractedClaim(BaseModel):
    claim_id: str
    source_id: str
    core_assertion: str 
    cited_evidence: Optional[str] = None
    evidence_type: Literal["STATISTIC", "QUOTE", "LEGAL_FILING", "SCIENTIFIC_STUDY", "UNSUPPORTED_ASSERTION"]

class MappedConflict(BaseModel):
    conflict_id: str
    theme: str
    claims_involved: List[str]
    conflict_type: Literal["DISPUTED_FACT", "DISPUTED_INTERPRETATION", "UNSUPPORTED_CONTRADICTION"]
    common_ground: Optional[str] = None

class SynthesisResult(BaseModel):
    outcome_category: Literal["STRONG_SUPPORT", "MIXED_EVIDENCE", "DUAL_ELEMENT_SUPPORT", "INSUFFICIENT_DATA"]
    central_analysis: str
    traceable_claims: List[str]

class AnalysisTask(BaseModel):
    task_id: str
    user_query: str
    sources_ingested: List[SourceArticle]
    extracted_claims: List[ExtractedClaim] = []
    mapped_conflicts: List[MappedConflict] = []
    final_synthesis: Optional[SynthesisResult] = None
    status: str
