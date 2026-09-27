import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MappedConflict, ConflictType } from '../types';

interface ConflictVisualizerProps {
  conflicts: MappedConflict[];
}

const getConflictTypeBadge = (type: ConflictType) => {
  switch (type) {
    case 'DISPUTED_FACT':
      return { label: 'Disputed Fact', bg: '#FEE2E2', text: '#991B1B' };
    case 'DISPUTED_INTERPRETATION':
      return { label: 'Disputed Interpretation', bg: '#EFF6FF', text: '#1D4ED8' };
    case 'UNSUPPORTED_CONTRADICTION':
    default:
      return { label: 'Unsupported Contradiction', bg: '#FEF3C7', text: '#92400E' };
  }
};

export const ConflictVisualizer: React.FC<ConflictVisualizerProps> = ({ conflicts }) => {
  if (!conflicts || conflicts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No explicit conflicts mapped.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {conflicts.map((item) => {
        const badge = getConflictTypeBadge(item.conflict_type);
        return (
          <View key={item.conflict_id} style={styles.conflictCard}>
            <View style={styles.topRow}>
              <Text style={styles.themeTitle}>{item.theme}</Text>
              <View style={[styles.typeBadge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.typeBadgeText, { color: badge.text }]}>
                  {badge.label}
                </Text>
              </View>
            </View>

            {item.common_ground ? (
              <View style={styles.commonGroundBox}>
                <Text style={styles.commonGroundLabel}>✓ Baseline Common Ground:</Text>
                <Text style={styles.commonGroundText}>{item.common_ground}</Text>
              </View>
            ) : null}

            <View style={styles.claimsBox}>
              <Text style={styles.claimsLabel}>Involved Claim IDs:</Text>
              <Text style={styles.claimsList}>{item.claims_involved.join(', ')}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  conflictCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  themeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  commonGroundBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 6,
    marginVertical: 6,
  },
  commonGroundLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 2,
  },
  commonGroundText: {
    fontSize: 12,
    color: '#14532D',
    lineHeight: 17,
  },
  claimsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  claimsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 6,
  },
  claimsList: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
});
