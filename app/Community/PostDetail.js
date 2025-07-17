import { router, useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, TouchableOpacity, Image, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PostDetail = () => {
  const { id } = useLocalSearchParams(); // 글 ID
  const [post, setPost] = useState(null);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  const db = getDatabase();
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const postRef = ref(db, `communityApp/posts/${id}`);
    const commentRef = ref(db, `communityApp/comments/${id}`);

    // 게시글 정보
    onValue(postRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPost(data);

        // 작성자 닉네임 가져오기
        const userRef = ref(db, `communityApp/users/${data.author.uid}`);
        onValue(userRef, (userSnap) => {
          const userData = userSnap.val();
          setNickname(userData?.nickname || userData?.email || '익명');
          setLoading(false);
        });
      }
    });

    // 댓글 목록 + 닉네임 매핑
    onValue(commentRef, async (snap) => {
    const data = snap.val();
    if (!data) {
        setComments([]);
        return;
    }

    const entries = Object.entries(data);
    const promises = entries.map(async ([key, val]) => {
      const userSnap = await new Promise((resolve) =>
        onValue(ref(db, `communityApp/users/${val.author.uid}`), resolve, { onlyOnce: true })
      );
      const userData = userSnap.val();
      return {
        id: key,
        ...val,
        authorNickname: userData?.nickname || val.author.email || '익명',
      };
    });

    const results = await Promise.all(promises);
    const sorted = results.sort((a, b) => a.timestamp - b.timestamp);
    setComments(sorted);
  });
  }, [id]);

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;

    const commentRef = ref(db, `communityApp/comments/${id}`);
    const newCommentRef = push(commentRef);

    await set(newCommentRef, {
      content: commentInput,
      timestamp: Date.now(),
      author: {
        uid: user.uid,
        email: user.email,
      },
    });

    setCommentInput('');
  };

  //게시글 삭제
  const handleDelete = () => {
    Alert.alert('확인', '정말 삭제하시겠습니까?', [
      { text: '취소' },
      {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
          await remove(ref(db, `communityApp/posts/${id}`));
          await remove(ref(db, `communityApp/comments/${id}`));
          router.replace('/Community/PostList');
          },
      },
    ]);
  }

  if (loading || !post) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* 게시글 제목 및 정보 */}
        <Text style={styles.title}>{post.title}</Text>
        <Text style={{ color: '#666', marginBottom: 10 }}>
          작성자: {nickname} | {new Date(post.timestamp).toLocaleString()}
        </Text>

        {/* 이미지 존재하는 경우 이미지 출력 */}
        {post.imageUrl ? (
          <Image
            source={{ uri: post.imageUrl }}
            style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 20 }}
          />
        ) : null}

        <Text style={{ fontSize: 16, lineHeight: 24, marginBottom: 30 }}>{post.content}</Text>
        
        {/* 게시글 수정 및 삭제 */}
        {user.uid === post.author.uid && (
          <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
              <TouchableOpacity
              style={styles.buttonDelete}
              onPress={() => {handleDelete()}}>
              <Text style={{color:'white', fontWeight:'bold'}}>게시글 삭제</Text>
              </TouchableOpacity>
          </View>
          )}

        {/* 댓글 목록 */}
        <View style={{borderTopWidth:1, borderColor:'gray', paddingTop:5}}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>댓글</Text>
          {comments.length === 0 && <Text style={{ color: '#888' }}>댓글이 없습니다.</Text>}

          {comments.map((comment) => (
            <View key={comment.id} style={{ marginBottom: 12, padding: 10, backgroundColor: '#f1f1f1', borderRadius: 6 }}>
                <Text style={{ fontWeight: 'bold' }}>{comment.authorNickname}</Text>
                <Text>{comment.content}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>{new Date(comment.timestamp).toLocaleString()}</Text>
            </View>
          ))}

          {/* 댓글 입력창 */}
          <View style={{ marginTop: 20 }}>
            <TextInput
              value={commentInput}
              onChangeText={setCommentInput}
              placeholder="댓글을 작성하세요"
              style={styles.input}
            />
            <TouchableOpacity style={styles.buttonComment} onPress={() => {handleCommentSubmit()}}>
              <Text style={{fontWeight:'bold'}}> 댓글 등록 </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PostDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgray',
        paddingHorizontal: 20,
    },
    title: {
      color: 'black',
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 3
    },
    buttonContainer: {
      width: '100%',
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
    },
    buttonDelete: {
        backgroundColor: "red",
        width: '100%',
        height: 30,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginVertical: 10,
    },
    buttonComment: {
      backgroundColor: "skyblue",
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
      width:'100%', 
      backgroundColor:'white'
    }
});