import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { QueryScreen } from './src/screens/QueryScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { AnalysisTask } from './src/types';

export default function App() {
  const [completedTask, setCompletedTask] = useState<AnalysisTask | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      {completedTask ? (
        <ResultScreen
          task={completedTask}
          onReset={() => setCompletedTask(null)}
        />
      ) : (
        <QueryScreen
          onAnalysisComplete={(task) => setCompletedTask(task)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
