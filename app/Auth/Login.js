import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, TouchableOpacity, Text, TextInput, View, StyleSheet } from 'react-native';
import { auth } from '../../firebaseConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 로그인
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('로그인 성공');
      router.replace('/Community/PostList'); // 로그인 후 홈으로 이동
    } catch (error) {
      Alert.alert('로그인 실패', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" placeholder="이메일 아이디" style={styles.input} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="비밀번호" style={styles.input} />
      <TouchableOpacity style={[styles.button, {backgroundColor:'skyblue', width:'80%'}]} onPress={() => {handleLogin()}}>
          <Text style={[styles.text, {color:'black'}]}>로그인</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {router.replace('/')}}>
          <Text style={styles.text}>홈으로</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {router.replace('./Register')}}>
          <Text style={styles.text}>회원가입</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'column', 
        alignItems:'center', 
        justifyContent:'center', 
        backgroundColor: 'lightgray',
    },
    buttonContainer: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:'80%',
        marginTop: 10,
    },
    title: {
        color: 'black',
        fontSize: 25,
    },
    button: {
        backgroundColor: "gray",
        width: '47%',
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    text: {
        color: 'white',
        fontWeight:'bold',
        fontSize: 15,
    },
    input: {
      borderWidth: 1, 
      marginBottom: 10, 
      width:'80%', 
      backgroundColor:'white'
    }
});