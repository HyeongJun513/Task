import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from 'expo-router';

const index = () => {
    return (
        <View style={styles.container}> 
            <Text style={styles.title}>간단한 커뮤니티 앱 MVP</Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => {router.replace('./Auth/Login')}}>
                    <Text style={styles.text}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => {router.replace('./Auth/Register')}}>
                    <Text style={styles.text}>회원가입</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default index;

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
        justifyContent:'center',
        padding: 10,
        marginTop: 10,
    },
    title: {
        color: 'black',
        fontSize: 25,
    },
    button: {
        backgroundColor: "gray",
        width: '40%',
        height: 50,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        margin: 10,
    },
    text: {
        color: 'white',
        fontWeight:'bold',
        fontSize: 15,
    },
});