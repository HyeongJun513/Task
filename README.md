# 간단한 커뮤니티 앱 MVP 개발
![MainScreen](./assets/images/MainScreen.png)

**주요 기능** : 회원가입/로그인, 글(목록/상세/작성), 이미지 첨부, 댓글

**기술 스택** : React Native(Expo), Firebase

**제작** : 박형준 

# 컴포넌트 경로
**메인** : app/index.js

**로그인** : app/Auth/Login.js

**회원가입** : app/Auth/Register.js

**닉네임 설정** : app/Auth/SetNickname.js

**글목록** : app/Community/PostList.js

**글상세** : app/Community/PostDetail.js

**글작성** : app/Community/WritePost.js

※ firebaseConfig.js 파일의 경우 GitHub 미업로드

_____

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
