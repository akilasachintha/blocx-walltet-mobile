import React, {useEffect, useState} from 'react';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {WalletData} from "@/app/main/validationRequests/RequestsScreen";

interface CommentLevel {
	[key: string]: {
		average: number;
		comments: number;
		total_score: number;
	};
}

interface Request {
	id: string;
	comment_level: CommentLevel;
	expire_time: number;
	post_grade: string;
	post_id: string;
	time_stamp: string;
	user_public_key: string;
	user_score: number;
	block: Block;
	request_id: string;
}

interface Block {
	block: string;
	id: string;
	request_id: string;
	time_stamp: number;
	validated_keys: string[];
}

interface BlockDetails {
	timestamp: number;
	data: BlockData;
	previous_hash: string;
	hash: string;
}

interface BlockData {
	transferer_public_key: string;
	reciever_public_key: string;
	transfer_amount: number;
	transferer_minted_token_balance: number;
	transferer_donated_token_balance: number;
	reciever_minted_token_balance: number;
	reciever_donated_token_balance: number;
	transferer_balnce: Balance;
	reciever_balnce: Balance;
}

interface Balance {
	minted: number;
	donated: number;
}

const RequestDetailsScreen: React.FC = () => {
	const router = useRouter();
	const {request, id} = useLocalSearchParams();
	const [requestData, setRequestData] = useState<Request | null>(null);
	const [blockDetails, setBlockDetails] = useState<BlockDetails | null>(null);
	const [showHashes, setShowHashes] = useState(false);
	const [showReceiverKey, setShowReceiverKey] = useState(false);
	const [showTransfererKey, setShowTransfererKey] = useState(false);
	const [loading, setLoading] = useState(false);
	const [publicKey, setPublicKey] = useState<string>('');
	const [, setPrivateKey] = useState<string>('');
	
	useEffect(() => {
		try {
			if (request) {
				const decodedRequest = decodeURIComponent(request as string);
				console.log('Decoded request:', decodedRequest);
				
				const parsedRequest = JSON.parse(decodedRequest);
				console.log('Parsed request object:', parsedRequest);
				
				if (parsedRequest.block && typeof parsedRequest.block === 'string') {
					const innerJsonString = parsedRequest.block.replace(/\\"/g, '"');
					const parsedBlock = JSON.parse(innerJsonString.replace(/"{/g, '{').replace(/}"/g, '}'));
					setBlockDetails(parsedBlock);
					console.log('Parsed block:', parsedBlock);
				} else {
					console.error("Block data is not in the expected format.");
				}
				
				setRequestData(parsedRequest);
				console.log('Final request data:', parsedRequest);
			}
		} catch (error) {
			console.error("Failed to parse JSON:", error);
		}
	}, [request]);
	
	useEffect(() => {
		const getWalletData = async () => {
			try {
				const walletDataString = await AsyncStorage.getItem('walletData');
				if (walletDataString) {
					const walletData: WalletData = JSON.parse(walletDataString);
					setPublicKey(walletData.public_key);
				}
				
				const privateKey = await AsyncStorage.getItem('privateKey');
				if (privateKey) {
					setPrivateKey(privateKey);
				}
				
			} catch (error) {
				console.error('Failed to load wallet data from AsyncStorage', error);
			}
		};
		
		getWalletData().catch(() => {
		});
	}, []);
	
	const handleValidateRequest = async () => {
		const requestData = {
			public_key: publicKey,
			validation_id: id
		};
		
		setLoading(true);
		
		try {
			const response = await axios.post('https://www.blockxserver.xyz/wallet/validate_request', requestData);
			if (response.data.state) {
				Alert.alert('Transaction Successful', 'Successfully Validated the Transaction');
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
	}
	
	if (!requestData || !blockDetails || !id || loading) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-50">
				<ActivityIndicator size="large" color="#0000ff"/>
			</View>
		);
	}
	
	return (
		<ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-gray-50">
			{/* Header Bar */}
			<View className="flex-row justify-between items-center bg-white px-4 py-5 mt-4 shadow-md">
				<Ionicons name="arrow-back" size={24} color="black" onPress={() => router.back()}/>
				<Text className="text-xl font-bold text-gray-900">Request Details</Text>
				<Ionicons name="notifications" size={24} color="black"/>
			</View>
			
			<View className="flex-1 items-center justify-start p-6">
				<View className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-6">
					<Text className="text-base text-gray-700">
						<Text className="font-semibold">Request Id: </Text>{requestData.request_id}
					</Text>
					<TouchableOpacity onPress={handleValidateRequest}>
						<Text className="text-center text-white mt-4 bg-green-700 py-4 rounded">Validate Request</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="mt-2 py-3 px-6 bg-blue-600 rounded-lg flex justify-center items-center shadow-md"
						onPress={() => router.push('/main/ViewMyChainScreen')}
					>
						<Text className="text-lg text-white text-center">View My Chain</Text>
					</TouchableOpacity>
				</View>
				
				{/* Block Details */}
				<View className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-6">
					<Text className="text-xl font-bold mb-4">Block Details</Text>
					
					<View className="mb-2 flex-row justify-between items-center">
						<Text className="font-semibold">Hash:</Text>
						<View className="flex-row items-center flex-1 ml-2">
							<Text className="text-gray-700 flex-1" numberOfLines={1} ellipsizeMode="tail">
								{showHashes ? blockDetails.hash : '••••••••••••'}
							</Text>
							<TouchableOpacity onPress={() => setShowHashes(!showHashes)}>
								<Ionicons name={showHashes ? "eye-off" : "eye"} size={20} color="gray"/>
							</TouchableOpacity>
						</View>
					</View>
					
					<View className="mb-2 flex-row justify-between items-center">
						<Text className="font-semibold">Previous Hash:</Text>
						<View className="flex-row items-center flex-1 ml-2">
							<Text className="text-gray-700 flex-1" numberOfLines={1} ellipsizeMode="tail">
								{showHashes ? blockDetails.previous_hash : '••••••••••••'}
							</Text>
							<TouchableOpacity onPress={() => setShowHashes(!showHashes)}>
								<Ionicons name={showHashes ? "eye-off" : "eye"} size={20} color="gray"/>
							</TouchableOpacity>
						</View>
					</View>
					
					<View className="mb-2 flex-row justify-between">
						<Text className="font-semibold">Timestamp:</Text>
						<Text
							className="text-gray-700">{new Date(blockDetails.timestamp * 1000).toLocaleString()}</Text>
					</View>
					
					<View className="mb-2 flex-row justify-between">
						<Text className="font-semibold">Transfer Amount:</Text>
						<Text className="text-gray-700">{blockDetails.data.transfer_amount}</Text>
					</View>
					
					<View className="mb-2 flex-row justify-between items-center">
						<Text className="font-semibold">Receiver Public Key:</Text>
						<View className="flex-row items-center flex-1 ml-2">
							<Text className="text-gray-700 flex-1" numberOfLines={1} ellipsizeMode="tail">
								{showReceiverKey ? blockDetails.data.reciever_public_key : '••••••••••••'}
							</Text>
							<TouchableOpacity onPress={() => setShowReceiverKey(!showReceiverKey)}>
								<Ionicons name={showReceiverKey ? "eye-off" : "eye"} size={20} color="gray"/>
							</TouchableOpacity>
						</View>
					</View>
					
					<View className="mb-2 flex-row justify-between">
						<Text className="font-semibold">Receiver Balance - Donated:</Text>
						<Text className="text-gray-700">{blockDetails.data.reciever_balnce.donated}</Text>
					</View>
					
					<View className="mb-2 flex-row justify-between">
						<Text className="font-semibold">Receiver Balance - Minted:</Text>
						<Text className="text-gray-700">{blockDetails.data.reciever_balnce.minted}</Text>
					</View>
					
					<View className="mb-2 flex-row justify-between items-center">
						<Text className="font-semibold">Transferer Public Key:</Text>
						<View className="flex-row items-center flex-1 ml-2">
							<Text className="text-gray-700 flex-1" numberOfLines={1} ellipsizeMode="tail">
								{showTransfererKey ? blockDetails.data.transferer_public_key : '••••••••••••'}
							</Text>
							<TouchableOpacity onPress={() => setShowTransfererKey(!showTransfererKey)}>
								<Ionicons name={showTransfererKey ? "eye-off" : "eye"} size={20} color="gray"/>
							</TouchableOpacity>
						</View>
					</View>
					
					<View className="mb-2 flex-row justify-between">
						<Text className="font-semibold">Transferer Balance - Donated:</Text>
						<Text className="text-gray-700">{blockDetails.data.transferer_balnce.donated}</Text>
					</View>
					
					<View className="mb-2 flex-row justify-between">
						<Text className="font-semibold">Transferer Balance - Minted:</Text>
						<Text className="text-gray-700">{blockDetails.data.transferer_balnce.minted}</Text>
					</View>
				</View>
			</View>
		</ScrollView>
	);
};

export default RequestDetailsScreen;
