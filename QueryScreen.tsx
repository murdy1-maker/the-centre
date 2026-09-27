import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SourceArticle, AnalysisTask } from '../types';
import { requestAnalysis } from '../services/api';

interface QueryScreenProps {
  onAnalysisComplete: (task: AnalysisTask) => void;
}

export const QueryScreen: React.FC<QueryScreenProps> = ({ onAnalysisComplete }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Built-in starter template demonstrating multi-perspective source ingestion
  const [sources, setSources] = useState<SourceArticle[]>([
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
  ]);

  const handleRunAnalysis = async () => {
    if (!query.trim()) {
      Alert.alert('Required Field', 'Please enter a target query or question to analyze.');
      return;
    }

    if (sources.length === 0) {
      Alert.alert('Sources Required', 'Please provide at least one source article for extraction.');
      return;
    }

    setLoading(true);
    setStatusMessage('Step 1/3: Extracting claims and stripping rhetoric...');

    try {
      const result = await requestAnalysis({ query, sources });
      setLoading(false);
      onAnalysisComplete(result);
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Analysis Failed', err.message || 'Unable to connect to backend engine.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>THE CENTRE</Text>
        <Text style={styles.headerSubtitle}>
          Triangulated synthesis across competing perspectives
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Analysis Query / Topic</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Is interest rate policy lagging economic contraction?"
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
          multiline
        />
      </View>

      <View style={styles.sourcesHeader}>
        <Text style={styles.sectionTitle}>Ingested Sources ({sources.length})</Text>
      </View>

      {sources.map((src, index) => (
        <View key={src.id} style={styles.sourceBox}>
          <View style={styles.sourceTop}>
            <Text style={styles.sourcePublisher}>{src.publisher}</Text>
            <Text style={styles.sourcePerspective}>[{src.perspective}]</Text>
          </View>
          <Text style={styles.sourceSnippet} numberOfLines={2}>
            {src.raw_text}
          </Text>
        </View>
      ))}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0F172A" />
          <Text style={styles.loadingText}>{statusMessage}</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.submitButton} onPress={handleRunAnalysis}>
          <Text style={styles.submitButtonText}>Run Central Analysis</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  titleContainer: {
    marginVertical: 18,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#0F172A',
    textAlignVertical: 'top',
  },
  sourcesHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  sourceBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sourceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sourcePublisher: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  sourcePerspective: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  sourceSnippet: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: '#475569',
  },
});
