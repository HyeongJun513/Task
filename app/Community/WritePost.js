import React, { useState } from 'react';
import { View, TextInput, Button, Image, Alert, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, push, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { router } from 'expo-router';

const WritePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  // 이미지 권한요청 및 선택
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('권한이 필요합니다', '이미지 선택을 위해 갤러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  //게시글 작성
  const handleSubmit = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();
    const storage = getStorage();

    if (!user) {
      Alert.alert('로그인 필요', '로그인 상태를 확인해주세요.');
      return;
    }

    if (!title.trim() || !content.trim()) {
      Alert.alert('입력 오류', '제목과 내용을 입력해주세요.');
      return;
    }

    try {
      let imageUrl = '';
      if (image) {
        const imageRef = storageRef(storage, `communityApp/posts/${Date.now()}.jpg`); //이미지명 날짜 스탬프 지정
        const response = await fetch(image);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      const postRef = push(dbRef(db, 'communityApp/posts'));
      await set(postRef, {
        title,
        content,
        imageUrl,
        timestamp: Date.now(),
        author: {
          uid: user.uid,
          email: user.email,
        },
      });

      Alert.alert('성공', '게시글이 등록되었습니다.');
      router.replace('/Community/PostList');
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex:3}}>
        <TextInput
          placeholder="제목"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="내용"
          value={content}
          onChangeText={setContent}
          multiline
          style={[styles.input, {height:'30%'}]}
        />
        <View style={{alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontWeight:'bold', fontSize:15, marginTop:20}}>첨부된 이미지</Text>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200, marginTop: 10, alignSelf: 'center' }}
            />
          ): <Text style={{marginTop:30, color:'gray'}}>이미지 없음</Text>}
        </View>
      </View>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => {pickImage()}}>
          <Text style={styles.text}>이미지 선택</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => {handleSubmit()}}>
          <Text style={styles.text}>게시글 작성</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WritePost;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'column', 
        backgroundColor: 'lightgray',
        padding: 10,
    },
    buttonContainer: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        width:'80%',
        marginTop: 10,
    },
    button: {
        backgroundColor: "skyblue",
        width: '100%',
        height: 40,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginVertical: 5,
    },
    text: {
        color: 'black',
        fontWeight:'bold',
        fontSize: 15,
    },
    input: {
      borderWidth: 1, 
      marginBottom: 10, 
      width:'100%', 
      backgroundColor:'white'
    }
});
