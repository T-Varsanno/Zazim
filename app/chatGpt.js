import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Linking,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import resourceLinks from './resourceLinks';
import Markdown from 'react-native-markdown-display';

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
          Authorization: 'Bearer ***********', // ⬅️ Replace with your actual key
          'HTTP-Referer': 'https://yourprojectname.com', // optional
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3-0324:free',
          messages: [
            {
              role: 'system',
              content: `You are a smart assistant that communicates in Hebrew and helps users who are recovering
              from injury and going through rehabilitation. Your main job is to assist them in locating,
              understanding, and filling out necessary documents and forms related to their rehabilitation process.
              These documents are located in a set of trusted links (only use links from the approved list).
              Always provide your answer in a clear, empathetic,
              and encouraging tone suitable for users who may be in physical or emotional distress.
              
              אתה עוזר חכם שמדבר בעברית, קוראים לו עזרא, ומסייע למשתקמים בתהליך שיקום.
              תפקידך לעזור באיתור, הבנה ומילוי טפסים רלוונטיים.
              תשתמש רק בקישורים האלה: ${Object.values(resourceLinks.trustedLinks).join(', ')}.
              אם נדרש מספר טלפון לעזרה – תוכל להציע את אחד מהבאים: ${resourceLinks.supportNumbers
                .map((n) => n.name + ': ' + n.number)
                .join(', ')}.`,
            },
            { role: 'user', content: question },
          ],
        }),
      });

      const data = await result.json();
      console.log('OpenRouter response:', data);
      console.log('Message content:', data.choices?.[0]?.message?.content);
      const answer =
        data.choices && data.choices.length > 0
          ? data.choices[0].message.content
          : '⚠️ No valid answer returned.';
      setResponse(answer);
    } catch (error) {
      setResponse('⚠️ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔗 Make links clickable
  const renderResponseWithLinks = (text) => {
    const parts = text.split(/(https?:\/\/[^\s]+)/g); // Split by links
    return parts.map((part, index) => {
      if (part.match(/https?:\/\/[^\s]+/)) {
        return (
          <Text
            key={index}
            style={{ color: '#4CC9F0', textDecorationLine: 'underline' }}
            onPress={() => Linking.openURL(part)}
          >
            {part}
          </Text>
        );
      } else {
        return <Text key={index}>{part}</Text>;
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            source={require('../assets/images/Ezra_ai.png')} 
            style={{ width: 40, height: 40, marginRight: 12, marginBottom: 10 }}
            resizeMode="contain"
          />
          <Text style={styles.title}>שאל את עזרא!</Text>
        </View>
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

        {response !== '' && (
          <View style={styles.response}>
            <Markdown>{response}</Markdown>
          </View>
        )}
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
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
});
