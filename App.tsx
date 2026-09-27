import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

const sampleAnalysis = {
  task_id: 'task-882194',
  user_query: 'Is interest rate policy lagging economic contraction?',
  sources_ingested: [
    {
      id: 'src_1',
      publisher: 'Global News Wire',
      perspective: 'CONSENSUS',
      raw_text: 'The central bank maintained current interest rates citing persistent 2.8% core inflation and stable employment figures according to the quarterly economic bulletin.'
    },
    {
      id: 'src_2',
      publisher: 'Contrarian Economic Review',
      perspective: 'CONTRARIAN',
      raw_text: 'Rate policy fails to reflect leading credit contraction indicators. Commercial lending fell 4.1% year-over-year, which historical cycles demonstrate triggers delayed recessions regardless of lagging employment metrics.'
    }
  ],
  extracted_claims: [
    {
      claim_id: 'c_01',
      source_id: 'src_1',
      core_assertion: 'Core inflation remains sticky at 2.8%, justifying rate maintenance.',
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
  }
};

export default function App() {
  const [query, setQuery] = useState('Is interest rate policy lagging economic contraction?');
  const [completedTask, setCompletedTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [activeTab, setActiveTab] = useState('SYNTHESIS');

  const handleRunAnalysis = () => {
    if (!query.trim()) return;
    setLoading(true);
    setStatusMsg('Step 1/3: Extracting claims and stripping rhetoric...');
    setTimeout(() => {
      setStatusMsg('Step 2/3: Mapping friction and finding common ground...');
      setTimeout(() => {
        setStatusMsg('Step 3/3: Synthesizing central analysis...');
        setTimeout(() => {
          setLoading(false);
          setCompletedTask({ ...sampleAnalysis, user_query: query });
        }, 700);
      }, 700);
    }, 700);
  };

  const getEvidenceColor = (type) => {
    switch (type) {
      case 'STATISTIC':
      case 'SCIENTIFIC_STUDY':
        return { bg: '#DCFCE7', text: '#15803D' };
      case 'QUOTE':
      case 'LEGAL_FILING':
        return { bg: '#FEF3C7', text: '#B45309' };
      default:
        return { bg: '#FEE2E2', text: '#B91C1C' };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>THE CENTRE</Text>
          <Text style={styles.tagline}>Triangulated synthesis across competing perspectives</Text>
        </View>

        {!completedTask ? (
          <View>
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>Query / Topic to Analyze</Text>
              <TextInput
                style={styles.input}
                value={query}
                onChangeText={setQuery}
                placeholder="Enter a topic or question..."
                multiline
              />
            </View>

            <Text style={styles.sectionLabel}>Ingested Sources (2)</Text>
            {sampleAnalysis.sources_ingested.map((src) => (
              <View key={src.id} style={styles.sourceBox}>
                <View style={styles.sourceRow}>
                  <Text style={styles.sourceName}>{src.publisher}</Text>
                  <Text style={styles.sourceTag}>[{src.perspective}]</Text>
                </View>
                <Text style={styles.sourceText}>{src.raw_text}</Text>
              </View>
            ))}

            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#0F172A" />
                <Text style={styles.loadingText}>{statusMsg}</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.btnPrimary} onPress={handleRunAnalysis}>
                <Text style={styles.btnPrimaryText}>Run Central Analysis</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View>
            <View style={styles.topRow}>
              <TouchableOpacity style={styles.btnSmall} onPress={() => setCompletedTask(null)}>
                <Text style={styles.btnSmallText}>← New Query</Text>
              </TouchableOpacity>
              <Text style={styles.taskBadge}>Task: {completedTask.task_id}</Text>
            </View>

            <View style={styles.queryBox}>
              <Text style={styles.queryLabel}>ANALYSIS SUBJECT</Text>
              <Text style={styles.queryText}>"{completedTask.user_query}"</Text>
            </View>

            <View style={styles.tabBar}>
              {['SYNTHESIS', 'CONFLICTS', 'CLAIMS'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tab, activeTab === t && styles.tabActive]}
                  onPress={() => setActiveTab(t)}
                >
                  <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                    {t === 'SYNTHESIS' ? 'Synthesis' : t === 'CONFLICTS' ? 'Friction (1)' : 'Claims (4)'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {activeTab === 'SYNTHESIS' && (
              <View style={styles.synthesisCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>CENTRAL ANALYSIS</Text>
                  <View style={styles.badgeGreen}>
                    <Text style={styles.badgeGreenText}>{completedTask.final_synthesis.outcome_category}</Text>
                  </View>
                </View>
                <Text style={styles.analysisBody}>
                  {completedTask.final_synthesis.central_analysis}
                </Text>
              </View>
            )}

            {activeTab === 'CONFLICTS' && (
              <View>
                {completedTask.mapped_conflicts.map((c) => (
                  <View key={c.conflict_id} style={styles.conflictCard}>
                    <Text style={styles.conflictTheme}>{c.theme}</Text>
                    <View style={styles.groundBox}>
                      <Text style={styles.groundLabel}>✓ Common Ground:</Text>
                      <Text style={styles.groundText}>{c.common_ground}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'CLAIMS' && (
              <View>
                {completedTask.extracted_claims.map((claim) => {
                  const badge = getEvidenceColor(claim.evidence_type);
                  return (
                    <View key={claim.claim_id} style={styles.claimCard}>
                      <View style={styles.claimHeader}>
                        <Text style={styles.claimSource}>{claim.source_id}</Text>
                        <View style={[styles.badgeBase, { backgroundColor: badge.bg }]}>
                          <Text style={[styles.badgeText, { color: badge.text }]}>{claim.evidence_type}</Text>
                        </View>
                      </View>
                      <Text style={styles.claimAssertion}>"{claim.core_assertion}"</Text>
                      <Text style={styles.claimEvidence}>Evidence: {claim.cited_evidence}</Text>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { padding: 16, paddingBottom: 40 },
  header: { alignItems: 'center', marginVertical: 14 },
  logo: { fontSize: 24, fontWeight: '900', letterSpacing: 2, color: '#0F172A' },
  tagline: { fontSize: 12, color: '#64748B', marginTop: 4, textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#1E293B', marginBottom: 6 },
  input: { minHeight: 60, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 6, padding: 8, fontSize: 14, color: '#0F172A' },
  sourceBox: { backgroundColor: '#FFFFFF', borderRadius: 6, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  sourceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  sourceName: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  sourceTag: { fontSize: 11, fontWeight: '600', color: '#2563EB' },
  sourceText: { fontSize: 12, color: '#475569', lineHeight: 16 },
  btnPrimary: { backgroundColor: '#0F172A', paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  btnPrimaryText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  loadingBox: { alignItems: 'center', marginVertical: 20 },
  loadingText: { marginTop: 10, fontSize: 13, color: '#475569' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  btnSmall: { backgroundColor: '#E2E8F0', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 6 },
  btnSmallText: { fontSize: 12, fontWeight: '700', color: '#0F172A' },
  taskBadge: { fontSize: 11, color: '#64748B', fontFamily: 'monospace' },
  queryBox: { backgroundColor: '#0F172A', borderRadius: 8, padding: 12, marginBottom: 12 },
  queryLabel: { fontSize: 10, fontWeight: '800', color: '#94A3B8', letterSpacing: 1 },
  queryText: { fontSize: 14, color: '#FFFFFF', fontWeight: '600', marginTop: 4 },
  tabBar: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 8, padding: 3, marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  tabActive: { backgroundColor: '#FFFFFF' },
  tabText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  tabTextActive: { color: '#0F172A', fontWeight: '700' },
  synthesisCard: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 14, borderWidth: 1.5, borderColor: '#0F172A' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: '#0F172A' },
  badgeGreen: { backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  badgeGreenText: { color: '#92400E', fontSize: 11, fontWeight: '700' },
  analysisBody: { fontSize: 14, color: '#1E293B', lineHeight: 21 },
  conflictCard: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', borderLeftWidth: 4, borderLeftColor: '#3B82F6' },
  conflictTheme: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  groundBox: { backgroundColor: '#F0FDF4', padding: 8, borderRadius: 4 },
  groundLabel: { fontSize: 11, fontWeight: '700', color: '#166534' },
  groundText: { fontSize: 12, color: '#14532D', marginTop: 2, lineHeight: 16 },
  claimCard: { backgroundColor: '#FFFFFF', borderRadius: 8, padding: 10, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  claimHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  claimSource: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  badgeBase: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  claimAssertion: { fontSize: 13, color: '#1E293B', marginBottom: 4 },
  claimEvidence: { fontSize: 11, color: '#64748B' }
});

