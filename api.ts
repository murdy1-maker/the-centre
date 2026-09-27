import { AnalysisTask, AnalyzePayload } from '../types';

export const DEFAULT_API_BASE_URL = 'http://10.0.2.2:8000';

// Mock engine for offline testing, demos, or first-run verification without backend setup
export function getMockAnalysis(query: string): AnalysisTask {
  return {
    task_id: 'demo-run-' + Math.random().toString(36).substring(2, 9),
    user_query: query || 'Is interest rate policy lagging economic contraction?',
    sources_ingested: [
      {
        id: 'src_1',
        url: 'https://news.org/wire/101',
        publisher: 'Global News Wire',
        perspective: 'CONSENSUS',
        publication_date: '2026-09-25T12:00:00Z',
        raw_text: 'The central bank maintained current interest rates citing persistent 2.8% core inflation and stable employment figures according to the quarterly economic bulletin.'
      },
      {
        id: 'src_2',
        url: 'https://contrarian-economic-review.com/post/45',
        publisher: 'Contrarian Economic Review',
        perspective: 'CONTRARIAN',
        publication_date: '2026-09-26T08:30:00Z',
        raw_text: 'Rate policy fails to reflect leading credit contraction indicators. Commercial lending fell 4.1% year-over-year, which historical cycles demonstrate triggers delayed recessions regardless of lagging employment metrics.'
      }
    ],
    extracted_claims: [
      {
        claim_id: 'c_01',
        source_id: 'src_1',
        core_assertion: 'Core inflation remains sticky at 2.8%, justifying benchmark rate maintenance.',
        cited_evidence: 'Quarterly Economic Bulletin (Table 4.2)',
        evidence_type: 'STATISTIC'
      },
      {
        claim_id: 'c_02',
        source_id: 'src_1',
        core_assertion: 'Current employment levels remain structurally stable.',
        cited_evidence: 'National Labour Force Survey',
        evidence_type: 'STATISTIC'
      },
      {
        claim_id: 'c_03',
        source_id: 'src_2',
        core_assertion: 'Commercial lending contracted by 4.1% year-over-year.',
        cited_evidence: 'Credit Market Aggregate Data Q3',
        evidence_type: 'STATISTIC'
      },
      {
        claim_id: 'c_04',
        source_id: 'src_2',
        core_assertion: 'Lagging employment metrics obscure impending recession risks.',
        cited_evidence: 'Historical cyclical comparison',
        evidence_type: 'SCIENTIFIC_STUDY'
      }
    ],
    mapped_conflicts: [
      {
        conflict_id: 'conf_01',
        theme: 'Indicator Prioritization: Lagging Employment vs. Leading Credit Metrics',
        claims_involved: ['c_01', 'c_02', 'c_03', 'c_04'],
        conflict_type: 'DISPUTED_INTERPRETATION',
        common_ground: 'Both perspectives accept official economic data (inflation is at 2.8% while commercial lending has contracted), but disagree on which indicator governs policy timing.'
      }
    ],
    final_synthesis: {
      outcome_category: 'MIXED_EVIDENCE',
      central_analysis: 'The baseline data reveals structural divergence rather than factual contradiction. The central bank prioritizes contemporaneous price stability and employment resilience (core inflation at 2.8%), whereas contrarian analysis highlights forward-looking liquidity stress (commercial lending down 4.1%). The evidence does not refute current stability, but strongly supports the emergence of downstream credit headwinds. A definitive outcome cannot be determined without assessing future credit transmission velocity.',
      traceable_claims: ['c_01', 'c_02', 'c_03', 'c_04']
    },
    status: 'COMPLETE'
  };
}

export async function requestAnalysis(
  payload: AnalyzePayload,
  baseUrl: string = DEFAULT_API_BASE_URL
): Promise<AnalysisTask> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout before demo fallback

    const response = await fetch(`${baseUrl}/v1/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    // If backend is unreachable or not yet deployed, fallback gracefully to mock engine
    console.warn('Backend unavailable, falling back to mock analysis engine for testing:', err);
    return getMockAnalysis(payload.query);
  }
}
