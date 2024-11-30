import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Token JWT:', data.token);
        setToken(data.token); // Armazena o token
        navigation.navigate('GraphScreen', { token: data.token });
      } else {
        setErrorMessage(data.message || 'Erro no login');
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar-se ao servidor.');
    }
  };

  const handleDeleteData = async () => {
    if (!token) {
      Alert.alert('Erro', 'Você precisa estar autenticado para deletar os dados.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3000/limpar-dados', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json(); // Capture a resposta
  
      if (response.ok) {
        Alert.alert('Sucesso', 'Os dados foram apagados com sucesso.');
      } else {
        console.error('Erro ao deletar:', data);
        Alert.alert('Erro', data.message || 'Erro ao tentar deletar os dados.');
      }
    } catch (error) {
      console.error('Erro ao conectar-se ao servidor:', error);
      Alert.alert('Erro', 'Erro ao conectar-se ao servidor.');
    }
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#8a8a8a"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#8a8a8a"
      />

      {/* Botão de login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Botão para apagar os dados */}
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteData}>
        <Text style={styles.buttonText}>Apagar Dados</Text>
      </TouchableOpacity>

      {/* Link para registro */}
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.registerButton}>Ainda não tem uma conta? Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f3f3f3',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    color: '#007BFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
