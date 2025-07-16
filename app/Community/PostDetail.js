import { router, useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { getDatabase, onValue, push, ref, remove, set } from 'firebase/database';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';

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

  // 댓글 작성 핸들러
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

  if (loading || !post) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <ScrollView style={{ padding: 20 }} keyboardShouldPersistTaps="handled">
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>{post.title}</Text>
      <Text style={{ color: '#666', marginBottom: 10 }}>
        작성자: {nickname} | {new Date(post.timestamp).toLocaleString()}
      </Text>

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
            {/* <Button title="수정" onPress={() => router.push(`/Community/EditPost?id=${id}`)} /> */}
            <Button
            title="삭제"
            color="red"
            onPress={() => {
                Alert.alert('확인', '정말 삭제하시겠습니까?', [
                { text: '취소' },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: async () => {
                    await remove(ref(db, `communityApp/posts/${id}`));
                    await remove(ref(db, `communityApp/comments/${id}`)); // 댓글도 함께 삭제
                    router.replace('/Community/PostList');
                    },
                },
                ]);
            }}
            />
        </View>
        )}

      {/* 댓글 목록 */}
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
        <Text style={{ marginBottom: 6 }}>댓글 작성</Text>
        <TextInput
          value={commentInput}
          onChangeText={setCommentInput}
          placeholder="댓글을 입력하세요"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 6,
            marginBottom: 10,
          }}
        />
        <Button title="등록" onPress={handleCommentSubmit} />
      </View>
    </ScrollView>
  );
};

export default PostDetail;

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