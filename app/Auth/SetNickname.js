import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

const SetNickname = () => {
  const [nickname, setNickname] = useState('');
  const auth = getAuth();
  const db = getDatabase();
  const router = useRouter();

  const handleSaveNickname = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('오류', '로그인 정보가 없습니다.');
      return;
    }

    try {
      await set(ref(db, `communityApp/users/${user.uid}`), {
        email: user.email,
        nickname: nickname,
      });

      Alert.alert('성공', '닉네임이 설정되었습니다!');
      router.replace('../Community/PostList'); // 홈으로 이동
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={nickname}
        onChangeText={setNickname}
        placeholder="커뮤니티 닉네임 입력"
        style={styles.input}
      />
      {/* <Button title="닉네임 저장" onPress={handleSaveNickname} /> */}
      <TouchableOpacity style={[styles.button, {backgroundColor:'skyblue', width:'80%'}]} onPress={() => {handleSaveNickname()}}>
          <Text style={[styles.text, {color:'black'}]}>닉네임 설정</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SetNickname;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'column', 
        alignItems:'center', 
        justifyContent:'center', 
        backgroundColor: 'lightgray',
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