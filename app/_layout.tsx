import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/components/useColorScheme';
import { NativeWindStyleSheet } from 'nativewind';
import ViewMyChainScreen from "@/app/main/ViewMyChainScreen";

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync().catch(() => {});

NativeWindStyleSheet.setOutput({
	default: 'native',
});

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [isCheckingLogin, setIsCheckingLogin] = useState<boolean>(true);
	const segments = useSegments();
	const router = useRouter();
	
	useEffect(() => {
		if (error) throw error;
	}, [error]);
	
	useEffect(() => {
		const checkLoginStatus = async () => {
			try {
				const value = await AsyncStorage.getItem('isLoggedIn');
				setIsLoggedIn(value === 'true');
			} catch (e) {
				console.error('Failed to fetch the login status.');
				setIsLoggedIn(false);
			} finally {
				setIsCheckingLogin(false);
			}
		};
		
		checkLoginStatus().catch(() => {});
	}, []);
	
	useEffect(() => {
		if (loaded && !isCheckingLogin) {
			SplashScreen.hideAsync().catch(() => {});
		}
	}, [loaded, isCheckingLogin]);
	
	useEffect(() => {
		if (!isCheckingLogin && loaded) {
			console.log(isLoggedIn);
			if (isLoggedIn) {
				router.navigate('/');
			} else {
				router.navigate('/auth/SignUpLoginScreen');
			}
		}
	}, [isCheckingLogin, isLoggedIn, loaded]);
	
	if (!loaded || isCheckingLogin) {
		return null;
	}
	
	return <RootLayoutNav />;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();
	
	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="auth/SignUpLoginScreen" options={{ headerShown: false }} />
				<Stack.Screen name="auth/SignUpScreen" options={{ headerShown: false }} />
				<Stack.Screen name="auth/LoginPrivateKeyScreen" options={{ headerShown: false }} />
				<Stack.Screen name="main/SendTokenScreen" options={{ headerShown: false }} />
				<Stack.Screen name="main/ViewMyChainScreen" options={{ headerShown: false }} />
				<Stack.Screen name="main/requests/RequestsScreen" options={{ headerShown: false }} />
				<Stack.Screen name="main/requests/[id]" options={{ headerShown: false }} />
				<Stack.Screen name="main/validationRequests/RequestsScreen" options={{ headerShown: false }} />
				<Stack.Screen name="main/validationRequests/[id]" options={{ headerShown: false }} />
			</Stack>
		</ThemeProvider>
	);
}
