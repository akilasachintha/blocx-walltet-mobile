import React, {useEffect, useState} from 'react';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface WalletData {
	private_key: string;
	public_key: string;
}

const SendTokenScreen: React.FC = () => {
	const router = useRouter();
	const {userPublicKey, requestId} = useLocalSearchParams<{ userPublicKey: string, requestId: string }>();
	const [accountId, setAccountId] = useState<string>('');
	const [privateKey, setPrivateKey] = useState<string>('');
	const [amount, setAmount] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [showFullAccountId, setShowFullAccountId] = useState<boolean>(false);
	const [showFullReceiverAccount, setShowFullReceiverAccount] = useState<boolean>(false);
	
	useEffect(() => {
		const getWalletData = async () => {
			try {
				const walletDataString = await AsyncStorage.getItem('walletData');
				if (walletDataString) {
					const walletData: WalletData = JSON.parse(walletDataString);
					setAccountId(walletData.public_key);
				}
				
				const privateKey = await AsyncStorage.getItem('privateKey');
				if (privateKey) {
					setPrivateKey(privateKey);
				}
				
				console.log(privateKey, accountId, userPublicKey);
				
			} catch (error) {
				console.error('Failed to load wallet data from AsyncStorage', error);
			}
		};
		
		getWalletData().catch(() => {
		});
	}, []);
	
	const truncateText = (text: string, length: number) => {
		return text.length > length ? `${text.substring(0, length)}...` : text;
	};
	
	const validateAndSend = async () => {
		if (isNaN(Number(amount)) || Number(amount) <= 0) {
			Alert.alert('Invalid amount', 'Please enter a valid number greater than zero.');
			return;
		}
		
		
		const requestData = {
			private_key: privateKey,
			transferer_public_key: accountId,
			reciever_public_key: userPublicKey,
			request_id: requestId,
			amount: Number(amount),
		};
		
		setLoading(true);
		
		try {
			const response = await axios.post('https://www.blockxserver.xyz/wallet/transaction', requestData);
			if (response.data.state) {
				Alert.alert('Transaction Successful', 'The token has been sent successfully.');
				router.push('/');
			} else {
				Alert.alert('Transaction Failed', response.data.error || 'An error occurred while sending the token.');
			}
		} catch (error) {
			console.error('Transaction error', error);
			Alert.alert('Transaction Failed', 'An error occurred while sending the token.');
		} finally {
			setLoading(false);
		}
	};
	
	return (
		<View className="flex-1 bg-gray-50">
			{/* Header Bar */}
			<View className="flex-row justify-between items-center bg-white px-4 py-5 mt-4 shadow-md">
				<Ionicons name="arrow-back" size={24} color="black" onPress={() => router.back()}/>
				<Text className="text-xl font-bold text-gray-900">Send Token</Text>
				<Ionicons name="notifications" size={24} color="black"/>
			</View>
			
			<View className="flex-1 items-center justify-start p-6">
				<View className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-6">
					<Text className="text-2xl font-bold mb-8 text-gray-900">Send Token</Text>
					
					<View className="space-y-4">
						<View className="w-full">
							<Text className="text-base mb-2 text-gray-700">Account ID:</Text>
							<TouchableOpacity
								className="border-b border-gray-300 dark:border-gray-600 py-2 text-gray-700 flex-row items-center"
								onPress={() => setShowFullAccountId(!showFullAccountId)}
							>
								<Text className="flex-1">
									{showFullAccountId ? accountId : truncateText(accountId, 20)}
								</Text>
								<Ionicons name={showFullAccountId ? "eye" : "eye-off"} size={20} color="gray"/>
							</TouchableOpacity>
						</View>
						
						<View className="w-full">
							<Text className="text-base mb-2 text-gray-700">Receiver Account:</Text>
							<TouchableOpacity
								className="border-b border-gray-300 dark:border-gray-600 py-2 text-gray-700 flex-row items-center"
								onPress={() => setShowFullReceiverAccount(!showFullReceiverAccount)}
							>
								<Text className="flex-1">
									{showFullReceiverAccount ? userPublicKey : truncateText(userPublicKey as string, 20)}
								</Text>
								<Ionicons name={showFullReceiverAccount ? "eye" : "eye-off"} size={20} color="gray"/>
							</TouchableOpacity>
						</View>
						
						<View className="w-full">
							<Text className="text-base mb-2 text-gray-700">Amount:</Text>
							<TextInput
								className="border-b border-gray-300 dark:border-gray-600 py-2"
								placeholder="Enter amount"
								keyboardType="numeric"
								autoCapitalize="none"
								autoComplete="off"
								value={amount}
								onChangeText={setAmount}
							/>
						</View>
						
						<TouchableOpacity
							className="mt-4 py-4 bg-blue-600 rounded-lg flex justify-center items-center shadow-md"
							onPress={validateAndSend}
							disabled={loading}
						>
							{loading ? (
								<ActivityIndicator size="small" color="#fff"/>
							) : (
								<Text className="text-base text-white text-center">Send</Text>
							)}
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
};

export default SendTokenScreen;
