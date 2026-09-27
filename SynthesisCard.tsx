import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SynthesisResult, OutcomeCategory } from '../types';

interface SynthesisCardProps {
  synthesis: SynthesisResult;
}

const getOutcomeBadge = (outcome: OutcomeCategory) => {
  switch (outcome) {
    case 'STRONG_SUPPORT':
      return { label: 'Strong Support', bg: '#DCFCE7', text: '#166534' };
    case 'DUAL_ELEMENT_SUPPORT':
      return { label: 'Dual Element Support', bg: '#E0E7FF', text: '#3730A3' };
    case 'MIXED_EVIDENCE':
      return { label: 'Mixed Evidence', bg: '#FEF3C7', text: '#92400E' };
    case 'INSUFFICIENT_DATA':
    default:
      return { label: 'Insufficient Data', bg: '#F1F5F9', text: '#475569' };
  }
};

export const SynthesisCard: React.FC<SynthesisCardProps> = ({ synthesis }) => {
  const badge = getOutcomeBadge(synthesis.outcome_category);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>CENTRAL ANALYSIS</Text>
        <View style={[styles.badge, { backgroundColor: badge.bg }]}>
          <Text style={[styles.badgeText, { color: badge.text }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      <Text style={styles.bodyText}>{synthesis.central_analysis}</Text>

      {synthesis.traceable_claims && synthesis.traceable_claims.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.footerLabel}>Traceable Claims Referenced:</Text>
          <Text style={styles.footerValue}>{synthesis.traceable_claims.join(', ')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#0F172A',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1E293B',
  },
  footer: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 6,
  },
  footerValue: {
    fontSize: 11,
    color: '#3B82F6',
    fontWeight: '600',
  },
});
