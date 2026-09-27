import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ExtractedClaim, EvidenceType } from '../types';

interface ClaimCardProps {
  claim: ExtractedClaim;
}

const getEvidenceBadgeColor = (type: EvidenceType) => {
  switch (type) {
    case 'SCIENTIFIC_STUDY':
    case 'STATISTIC':
      return { bg: '#DCFCE7', text: '#15803D' };
    case 'LEGAL_FILING':
    case 'QUOTE':
      return { bg: '#FEF3C7', text: '#B45309' };
    case 'UNSUPPORTED_ASSERTION':
    default:
      return { bg: '#FEE2E2', text: '#B91C1C' };
  }
};

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim }) => {
  const badgeStyle = getEvidenceBadgeColor(claim.evidence_type);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.sourceText}>Source: {claim.source_id}</Text>
        <View style={[styles.badge, { backgroundColor: badgeStyle.bg }]}>
          <Text style={[styles.badgeText, { color: badgeStyle.text }]}>
            {claim.evidence_type.replace('_', ' ')}
          </Text>
        </View>
      </View>
      <Text style={styles.assertionText}>"{claim.core_assertion}"</Text>
      {claim.cited_evidence ? (
        <View style={styles.evidenceContainer}>
          <Text style={styles.evidenceLabel}>Cited Evidence:</Text>
          <Text style={styles.evidenceText}>{claim.cited_evidence}</Text>
        </View>
      ) : (
        <Text style={styles.unsupportedText}>No supporting evidence cited.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sourceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  assertionText: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
    marginBottom: 6,
  },
  evidenceContainer: {
    marginTop: 4,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 4,
  },
  evidenceLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 2,
  },
  evidenceText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 16,
  },
  unsupportedText: {
    fontSize: 12,
    color: '#94A3B8',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
