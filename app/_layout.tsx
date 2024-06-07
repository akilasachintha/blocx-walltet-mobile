import FontAwesome from '@expo/vector-icons/FontAwesome';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/components/useColorScheme';
import {NativeWindStyleSheet} from "nativewind";

export {
	ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync().catch(() => {
});

NativeWindStyleSheet.setOutput({
	default: "native",
});

export default function RootLayout() {
	const [loaded, error] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
		...FontAwesome.font,
	});
	
	useEffect(() => {
		if (error) throw error;
	}, [error]);
	
	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync().catch(() => {
			});
		}
	}, [loaded]);
	
	if (!loaded) {
		return null;
	}
	
	return <RootLayoutNav/>;
}

function RootLayoutNav() {
	const colorScheme = useColorScheme();
	
	return (
		<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack initialRouteName="index">
				<Stack.Screen name="index" options={{headerShown: false}}/>
				<Stack.Screen name="auth/SignUpLoginScreen" options={{headerShown: false}}/>
				<Stack.Screen name="auth/SignUpScreen" options={{headerShown: false}}/>
				<Stack.Screen name="main/LoginPrivateKeyScreen" options={{headerShown: false}}/>
				<Stack.Screen name="main/SendTokenScreen" options={{headerShown: false}}/>
				<Stack.Screen name="main/requests/RequestsScreen" options={{headerShown: false}}/>
				<Stack.Screen name="main/requests/[id]" options={{headerShown: false}}/>
			</Stack>
		</ThemeProvider>
	);
}
