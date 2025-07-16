import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Alert, TouchableOpacity, Text, TextInput, View, StyleSheet } from 'react-native';
import { auth } from '../../firebaseConfig';
import { router } from 'expo-router';

const Register = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('회원가입 성공', '이제 닉네임을 설정해주세요.');
      router.replace('/Auth/SetNickname');
    } catch (error) {
      Alert.alert('회원가입 실패', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" placeholder='이메일 아이디' style={styles.input} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder='비밀번호(6자 이상)' style={styles.input} />
      <TouchableOpacity style={[styles.button, {backgroundColor:'skyblue', width:'80%'}]} onPress={() => {handleRegister()}}>
          <Text style={[styles.text, {color:'black'}]}>회원가입</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {router.replace('/')}}>
          <Text style={styles.text}>홈으로</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {router.replace('./Login')}}>
          <Text style={styles.text}>로그인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;

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