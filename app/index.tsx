import React, {useEffect, useState} from 'react';
import {useRouter} from 'expo-router';
import {Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome5, Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AccountDetails {
	donated_tokens: number;
	minted_tokens: number;
	public_key: string;
}

export default function AccountDetailsScreen() {
	const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
	const router = useRouter();
	
	useEffect(() => {
		const loadAccountDetails = async () => {
			try {
				const data = await AsyncStorage.getItem('walletData');
				if (data) {
					setAccountDetails(JSON.parse(data));
				}
			} catch (error) {
				console.error('Failed to load account details', error);
			}
		};
		
		loadAccountDetails().catch(() => {
		});
	}, []);
	
	const handleLogout = async () => {
		try {
			await AsyncStorage.setItem('isLoggedIn', 'false');
			await AsyncStorage.removeItem('walletData');
			router.navigate('/auth/SignUpLoginScreen');
		} catch (error) {
			console.error('Failed to log out', error);
			Alert.alert('Error', 'An error occurred while logging out.');
		}
	};
	
	return (
		<View className="flex-1 bg-gray-50">
			<View className="flex-row justify-between items-center bg-white px-4 py-5 mt-4 shadow-md">
				<Ionicons name="menu" size={24} color="black"/>
				<Text className="text-xl font-bold text-gray-900">Wallet</Text>
				<Ionicons name="notifications" size={24} color="black"/>
			</View>
			
			<View className="flex-1 items-center justify-start p-6">
				<View className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-6">
					<View className="flex-row items-center mb-4">
						<Image
							source={{uri: 'https://avatars.githubusercontent.com/u/583231?v=4'}}
							className="w-16 h-16 rounded-full"
							resizeMode="cover"
						/>
						<View className="ml-4">
							<Text className="text-xl font-bold text-gray-900">Wallet</Text>
							{accountDetails && (
								<Text
									className="text-sm text-gray-500">{accountDetails.public_key.slice(0, 20)}...{accountDetails.public_key.slice(-4)}</Text>
							)}
						</View>
					</View>
					
					{accountDetails && (
						<View className="space-y-2">
							<Text className="text-base text-gray-700">
								<Text className="font-semibold">Balances: </Text>1.2 ETH
							</Text>
							<Text className="text-base text-gray-700">
								<Text className="font-semibold">Minted: </Text>{accountDetails.minted_tokens} Tokens
							</Text>
							<Text className="text-base text-gray-700">
								<Text className="font-semibold">Donated: </Text>{accountDetails.donated_tokens} Tokens
							</Text>
							<Text className="text-base text-gray-700">
								<Text className="font-semibold">Requests: </Text>2 Pending
							</Text>
						</View>
					)}
				</View>
				
				<View className="w-full flex-1 bg-white rounded-lg shadow-lg p-3">
					<View className="flex-row justify-around mt-6 gap-2">
						<TouchableOpacity
							className="flex-1 py-3 bg-blue-600 rounded-lg flex justify-center items-center shadow-md"
							onPress={() => router.push('/main/requests/RequestsScreen')}
						>
							<FontAwesome5 name="eye" size={20} color="white"/>
							<Text className="text-md text-white mt-2">View Requests</Text>
						</TouchableOpacity>
						
						<TouchableOpacity
							className="flex-1 bg-green-600 rounded-lg flex justify-center items-center shadow-md"
							onPress={() => router.push('/main/SendTokenScreen')}
						>
							<FontAwesome5 name="paper-plane" size={20} color="white"/>
							<Text className="text-md text-white mt-2">Send Token</Text>
						</TouchableOpacity>
					</View>
				</View>
				
				<TouchableOpacity
					className="mt-4 py-4 bg-red-600 rounded-lg flex justify-center items-center shadow-md w-full max-w-md"
					onPress={handleLogout}
				>
					<Text className="text-base text-white text-center">Logout</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
