import React, {useState} from 'react';
import axios from 'axios';
import {useRouter} from 'expo-router';
import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginRequest {
	private_key: string;
}

interface LoginResponse {
	donated_tokens: number;
	minted_tokens: number;
	public_key: string;
	state: boolean;
}

const LoginPrivateKeyScreen: React.FC = () => {
	const [privateKey, setPrivateKey] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();
	
	const handleLogin = async () => {
		if (!privateKey) {
			Alert.alert('Error', 'Please enter your private key');
			return;
		}
		
		setLoading(true);
		
		const requestData: LoginRequest = {
			private_key: privateKey,
		};
		
		try {
			const response = await axios.post<LoginResponse>('https://www.blockxserver.xyz/wallet/login', requestData);
			console.log(response.data);
			
			if (response.data.state) {
				await AsyncStorage.setItem('isLoggedIn', 'true');
				await AsyncStorage.setItem('walletData', JSON.stringify(response.data));
				await AsyncStorage.setItem('privateKey', privateKey);
				router.replace('');
			} else {
				Alert.alert('Login Failed', 'Invalid private key');
			}
		} catch (error) {
			console.error('Login error', error);
			Alert.alert('Login Failed', 'An error occurred while logging in');
		} finally {
			setLoading(false);
		}
	};
	
	return (
		<View className="flex-1 items-center justify-center p-5">
			<Text className="text-2xl font-bold mb-8">Login with Private Key</Text>
			<View className="w-full max-w-md space-y-4">
				<View className="w-full">
					<TextInput
						className="border-b border-gray-300 dark:border-gray-600 py-2"
						placeholder="Enter your private key"
						secureTextEntry
						autoCapitalize="none"
						autoComplete="password"
						value={privateKey}
						onChangeText={setPrivateKey}
					/>
				</View>
				<TouchableOpacity
					className="mt-4 py-4 bg-blue-500 rounded-lg flex justify-center items-center"
					onPress={handleLogin}
					disabled={loading}
				>
					{loading ? (
						<ActivityIndicator size="small" color="#fff"/>
					) : (
						<Text className="text-base text-white text-center">Login</Text>
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default LoginPrivateKeyScreen;
