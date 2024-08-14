import React, {useState} from 'react';
import {Stack, useRouter} from 'expo-router';
import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RegisterRequest {
	email: string;
}

interface RegisterResponse {
	private_key?: string;
	public_key?: string;
	state: boolean;
	error?: string;
}

const SignUpScreen: React.FC = () => {
	const router = useRouter();
	const [email, setEmail] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	
	const handleSignUp = async () => {
		if (!email) {
			Alert.alert('Error', 'Please enter your email');
			return;
		}
		
		setLoading(true);
		
		const requestData: RegisterRequest = {
			email: email,
		};
		
		try {
			const response = await axios.post<RegisterResponse>('https://www.blockxserver.xyz/wallet/register', requestData);
			console.log(response.data);
			
			if (response.data.state) {
				await AsyncStorage.setItem('walletData', JSON.stringify(response.data));
				router.push('/main/LoginPrivateKeyScreen');
			} else {
				Alert.alert('Registration Failed', response.data.error || 'Something went wrong during registration');
			}
		} catch (error) {
			console.error('Registration error', error);
			Alert.alert('Registration Failed', 'An error occurred while registering');
		} finally {
			setLoading(false);
		}
	};
	
	return (
		<>
			<Stack.Screen options={{title: 'SignUp'}}/>
			<View className="flex-1 items-center justify-center p-5">
				<Text className="text-2xl font-bold mb-8">Sign Up</Text>
				
				<View className="w-full max-w-md space-y-4">
					<View className="w-full">
						<Text className="text-base mb-2">Email:</Text>
						<TextInput
							className="border-b border-gray-300 dark:border-gray-600 py-2"
							placeholder="Enter your email"
							keyboardType="email-address"
							autoCapitalize="none"
							autoComplete="email"
							value={email}
							onChangeText={setEmail}
						/>
					</View>
					
					<TouchableOpacity
						className="mt-4 py-4 bg-blue-500 rounded-lg flex justify-center items-center"
						onPress={handleSignUp}
						disabled={loading}
					>
						{loading ? (
							<ActivityIndicator size="small" color="#fff"/>
						) : (
							<Text className="text-base text-white text-center">Sign Up</Text>
						)}
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
};

export default SignUpScreen;
