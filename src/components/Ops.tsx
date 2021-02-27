
import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

export default function OpsComponent() {
    return (
        <View style={styles.opsContainer}>
        <Text style={styles.opsText}>Ops!</Text>
        <Text style={styles.message}>Você não pode realizar esta ação sem possuir um cadastro.</Text>
        <TouchableOpacity style={styles.button}>
          <Text>Fazer cadastro</Text>
        </TouchableOpacity>
        <Text style={styles.message}>Já possui cadastro?</Text>
        <TouchableOpacity style={styles.button}>
          <Text>Fazer login</Text>
        </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({
  opsContainer: {
    width: 232,
    alignItems: 'center'
  },
  opsText: {
    fontFamily: "Courgette_400Regular",
    fontSize: 53,
    color: "#88c9bf",
    marginVertical: 52
  },
  message: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    color: "#757575",
    marginBottom: 16,
    textAlign: 'center'
  },
  button: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    color: "#434343",
    backgroundColor: "#88c9bf",
    marginBottom: 44,
    padding: 10,
    width: 232,
    height: 40,
    alignItems: "center"
  }
})