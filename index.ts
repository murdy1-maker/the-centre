export type PerspectiveType = 
  | 'CONSENSUS' 
  | 'CONTRARIAN' 
  | 'PRO_ESTABLISHMENT' 
  | 'SKEPTIC' 
  | 'NEUTRAL_PRIMARY';

export type EvidenceType = 
  | 'STATISTIC' 
  | 'QUOTE' 
  | 'LEGAL_FILING' 
  | 'SCIENTIFIC_STUDY' 
  | 'UNSUPPORTED_ASSERTION';

export type ConflictType = 
  | 'DISPUTED_FACT' 
  | 'DISPUTED_INTERPRETATION' 
  | 'UNSUPPORTED_CONTRADICTION';

export type OutcomeCategory = 
  | 'STRONG_SUPPORT' 
  | 'MIXED_EVIDENCE' 
  | 'DUAL_ELEMENT_SUPPORT' 
  | 'INSUFFICIENT_DATA';

export interface SourceArticle {
  id: string;
  url: string;
  publisher: string;
  perspective: PerspectiveType;
  publication_date: string;
  raw_text: string;
}

export interface ExtractedClaim {
  claim_id: string;
  source_id: string;
  core_assertion: string;
  cited_evidence?: string | null;
  evidence_type: EvidenceType;
}

export interface MappedConflict {
  conflict_id: string;
  theme: string;
  claims_involved: string[];
  conflict_type: ConflictType;
  common_ground?: string | null;
}

export interface SynthesisResult {
  outcome_category: OutcomeCategory;
  central_analysis: string;
  traceable_claims: string[];
}

export interface AnalysisTask {
  task_id: string;
  user_query: string;
  sources_ingested: SourceArticle[];
  extracted_claims: ExtractedClaim[];
  mapped_conflicts: MappedConflict[];
  final_synthesis?: SynthesisResult | null;
  status: string;
}

export interface AnalyzePayload {
  query: string;
  sources: SourceArticle[];
}
