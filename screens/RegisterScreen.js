import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    // Limpar mensagens de erro e sucesso
    setErrorMessage('');
    setSuccessMessage('');

    // Validação simples
    if (!username || !password) {
      setErrorMessage('Preencha todos os campos.');
      return;
    }

    setIsLoading(true); // Exibir indicador de carregamento

    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registro concluído com sucesso!');
        setTimeout(() => {
          navigation.navigate('LoginScreen'); // Navegar para a tela de login após 2 segundos
        }, 2000);
      } else {
        setErrorMessage(data.message || 'Erro no registro.');
      }
    } catch (error) {
      setErrorMessage('Erro ao conectar-se ao servidor.');
    } finally {
      setIsLoading(false); // Parar o indicador de carregamento
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar</Text>

      {/* Mensagens de erro e sucesso */}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

      {/* Campos de entrada */}
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

      {/* Botão de registro com indicador de carregamento */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrar</Text>
        </TouchableOpacity>
      )}

      {/* Link para login */}
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
        <Text style={styles.backToLogin}>Já possui uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
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
  success: {
    color: 'green',
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToLogin: {
    color: '#007BFF',
    marginTop: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});