import React, {useEffect, useState} from 'react';
import {useRouter} from 'expo-router';
import {ActivityIndicator, Alert, Image, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome5, Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface AccountDetails {
	donated_tokens: number;
	minted_tokens: number;
	public_key: string;
}

interface Request {
	id: string;
}

const AccountDetailsScreen: React.FC = () => {
	const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
	const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);
	const [showFullPublicKey, setShowFullPublicKey] = useState<boolean>(false);
	const router = useRouter();
	
	useEffect(() => {
		const loadAccountDetails = async () => {
			try {
				const [data, privateKey] = await Promise.all([
					AsyncStorage.getItem('walletData'),
					AsyncStorage.getItem('privateKey')
				]);
				
				if (data && privateKey) {
					const parsedData: AccountDetails = JSON.parse(data);
					
					const loginResponse = await axios.post('https://www.blockxserver.xyz/wallet/login', {
						private_key: privateKey,
					});
					
					if (loginResponse.data.state) {
						const updatedData: AccountDetails = {
							...parsedData,
							minted_tokens: loginResponse.data.minted_tokens,
							donated_tokens: loginResponse.data.donated_tokens,
						};
						setAccountDetails(updatedData);
						await AsyncStorage.setItem('walletData', JSON.stringify(updatedData));
					} else {
						Alert.alert('Error', loginResponse.data.error || 'Failed to refresh account details.');
					}
					
					const getRequestsResponse = await axios.post<Request[]>('https://www.blockxserver.xyz/wallet/get_requests', {
						public_key: parsedData.public_key,
					});
					
					setPendingRequestsCount(getRequestsResponse.data.length);
				} else {
					console.log('Error', 'Missing wallet data or private key.');
				}
			} catch (error) {
				console.error('Failed to load account details', error);
				Alert.alert('Error', 'An error occurred while loading account details.');
			} finally {
				setLoading(false);
			}
		};
		
		loadAccountDetails().catch(() => {
		});
	}, []);
	
	const handleLogout = async () => {
		try {
			await AsyncStorage.setItem('isLoggedIn', 'false');
			await AsyncStorage.removeItem('walletData');
			await AsyncStorage.removeItem('privateKey');
			router.navigate('/auth/SignUpLoginScreen');
		} catch (error) {
			console.error('Failed to log out', error);
			Alert.alert('Error', 'An error occurred while logging out.');
		}
	};
	
	if (loading) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-50">
				<ActivityIndicator size="large" color="#0000ff"/>
			</View>
		);
	}
	
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
						<View className="ml-4 flex-1">
							<Text className="text-xl font-bold text-gray-900">Wallet</Text>
							{accountDetails && (
								<TouchableOpacity
									className="flex-row items-center mt-2"
									onPress={() => setShowFullPublicKey(!showFullPublicKey)}
								>
									<Text className="flex-1 text-sm text-gray-500">
										{showFullPublicKey ? accountDetails.public_key : `${accountDetails.public_key.slice(0, 15)}...${accountDetails.public_key.slice(-4)}`}
									</Text>
									<Ionicons name={showFullPublicKey ? "eye-off" : "eye"} size={20} color="gray"/>
								</TouchableOpacity>
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
								<Text className="font-semibold">Requests: </Text>{pendingRequestsCount} Pending
							</Text>
						</View>
					)}
				</View>
				
				<View className="w-full bg-white rounded-lg shadow-lg p-3">
					<View className="flex-row justify-around mt-6 gap-2">
						<TouchableOpacity
							className="flex-1 py-3 bg-blue-600 rounded-lg flex justify-center items-center shadow-md"
							onPress={() => router.push('/main/requests/RequestsScreen')}
						>
							<FontAwesome5 name="eye" size={20} color="white"/>
							<Text className="text-md text-white mt-2">View Requests</Text>
						</TouchableOpacity>
					</View>
				</View>
				
				<View className="w-full flex-1 bg-white rounded-lg shadow-lg p-3">
					<View className="flex-row justify-around mt-6 gap-2">
						<TouchableOpacity
							className="flex-1 py-3 bg-green-600 rounded-lg flex justify-center items-center shadow-md"
							onPress={() => router.push('/main/validationRequests/RequestsScreen')}
						>
							<FontAwesome5 name="eye" size={20} color="white"/>
							<Text className="text-md text-white mt-2">Validation Requests</Text>
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
};

export default AccountDetailsScreen;
