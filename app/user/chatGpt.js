import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatGPT() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askChatGPT = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const result = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization':'Bearer ***************************************************', // ⬅️ Replace with your actual key
          'HTTP-Referer': 'https://yourprojectname.com', // optional but good practice
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'deepseek/deepseek-chat-v3-0324:free',
          messages: [
                {
                  role: 'system',
                  content: `You are a smart assistant that helps users by answering questions in Hebrow based on the following knowledge:
                            - This app is for 
                            - You should always end with a helpful tip
                            - When asked for links, use only the provided list of trusted sites.`,
                },
            { role: 'user', content: question }],
        }),
      });

      const data = await result.json();
      console.log('OpenRouter response:', data);
        const answer = data.choices && data.choices.length > 0
        ? data.choices[0].message.content
        : '⚠️ No valid answer returned.';
      setResponse(answer);
    } catch (error) {
      setResponse('⚠️ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>שאל את GPT</Text>

        <TextInput
          style={styles.input}
          value={question}
          onChangeText={setQuestion}
          placeholder="מה אתה רוצה לשאול?"
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={askChatGPT}>
          <Text style={styles.buttonText}>שלח שאלה</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#4CC9F0" style={{ marginTop: 20 }} />}
        {response !== '' && <Text style={styles.response}>{response}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    minHeight: 100,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#4CC9F0',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  response: {
    marginTop: 24,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
  },
});
