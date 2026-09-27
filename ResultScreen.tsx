import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { AnalysisTask } from '../types';
import { SynthesisCard } from '../components/SynthesisCard';
import { ConflictVisualizer } from '../components/ConflictVisualizer';
import { ClaimCard } from '../components/ClaimCard';

interface ResultScreenProps {
  task: AnalysisTask;
  onReset: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ task, onReset }) => {
  const [activeTab, setActiveTab] = useState<'SYNTHESIS' | 'CONFLICTS' | 'CLAIMS'>('SYNTHESIS');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onReset}>
          <Text style={styles.backButtonText}>← New Query</Text>
        </TouchableOpacity>
        <Text style={styles.taskBadge}>Task: {task.task_id.slice(0, 8)}</Text>
      </View>

      <View style={styles.querySummaryBox}>
        <Text style={styles.queryLabel}>QUERY EVALUATED</Text>
        <Text style={styles.queryText}>"{task.user_query}"</Text>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'SYNTHESIS' && styles.activeTab]}
          onPress={() => setActiveTab('SYNTHESIS')}
        >
          <Text style={[styles.tabText, activeTab === 'SYNTHESIS' && styles.activeTabText]}>
            Synthesis
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'CONFLICTS' && styles.activeTab]}
          onPress={() => setActiveTab('CONFLICTS')}
        >
          <Text style={[styles.tabText, activeTab === 'CONFLICTS' && styles.activeTabText]}>
            Friction Map ({task.mapped_conflicts.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'CLAIMS' && styles.activeTab]}
          onPress={() => setActiveTab('CLAIMS')}
        >
          <Text style={[styles.tabText, activeTab === 'CLAIMS' && styles.activeTabText]}>
            Claims ({task.extracted_claims.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Contents */}
      {activeTab === 'SYNTHESIS' && (
        <View>
          {task.final_synthesis ? (
            <SynthesisCard synthesis={task.final_synthesis} />
          ) : (
            <Text style={styles.emptyText}>No synthesis result returned.</Text>
          )}
        </View>
      )}

      {activeTab === 'CONFLICTS' && (
        <View>
          <ConflictVisualizer conflicts={task.mapped_conflicts} />
        </View>
      )}

      {activeTab === 'CLAIMS' && (
        <View style={styles.claimsList}>
          {task.extracted_claims.map((claim) => (
            <ClaimCard key={claim.claim_id} claim={claim} />
          ))}
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 6,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  taskBadge: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'monospace',
  },
  querySummaryBox: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  queryLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#94A3B8',
    marginBottom: 4,
  },
  queryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    padding: 3,
    marginBottom: 14,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#0F172A',
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 20,
  },
  claimsList: {
    marginTop: 6,
  },
});
