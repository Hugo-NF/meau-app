import React from 'react';
import { StyleSheet, View } from 'react-native';
import OpsComponent from './components/Ops';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  }
});

export default function App() : JSX.Element {
  return (
    <View style={styles.container}>
      <OpsComponent></OpsComponent>
    </View>
  );
}
