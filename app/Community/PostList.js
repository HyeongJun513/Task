import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const db = getDatabase();

    const usersRef = ref(db, 'communityApp/users');
    const postsRef = ref(db, 'communityApp/posts');

    let userMap = {};

    // 1. 유저 목록 먼저 불러오기
    onValue(usersRef, (userSnap) => {
      const users = userSnap.val();
      if (users) {
        Object.entries(users).forEach(([uid, info]) => {
          userMap[uid] = info.nickname || info.email;
        });
      }

      // 2. 유저 정보를 다 받아온 다음에, 글 목록 불러오기
      onValue(postsRef, (postSnap) => {
        const data = postSnap.val();
        if (data) {
          const postArray = Object.entries(data)
            .map(([id, post]) => ({
              id,
              ...post,
              nickname: userMap[post.author?.uid] || post.author?.email || '익명',
            }))
            .sort((a, b) => b.timestamp - a.timestamp);

          setPosts(postArray);
        } else {
          setPosts([]);
        }
        setLoading(false);
      });
    });

    return () => {
      // cleanup 생략 가능
    };
  }, []);

    // 🔹 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('로그아웃 되었습니다');
      router.replace('/'); // 홈 화면으로 이동
    } catch (error) {
      Alert.alert('로그아웃 실패', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 12,
        marginVertical: 6,
        backgroundColor: '#eee',
        borderRadius: 8,
      }}
      onPress={() => router.push(`/Community/PostDetail?id=${item.id}`)}
    >
      <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
      <Text style={{ fontSize: 14 }}>작성자: {item.nickname}</Text>
      <Text style={{ fontSize: 12, color: '#888' }}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>게시글이 없습니다.</Text>}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {handleLogout()}}>
          <Text style={styles.text}>로그아웃</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor:'skyblue'}]} onPress={() => {router.push('./WritePost')}}>
          <Text style={[styles.text, {color:'black'}]}>글 작성</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PostList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgray',
        paddingHorizontal: 20,
    },
    buttonContainer: {
      width: '100%',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
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

