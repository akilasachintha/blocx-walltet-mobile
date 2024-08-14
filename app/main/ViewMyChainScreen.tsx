import React, {useEffect, useState} from 'react';
import {useRouter} from 'expo-router';
import {ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {WalletData} from '@/app/main/validationRequests/RequestsScreen';

interface Balance {
	donated: number;
	minted: number;
}

interface Data {
	reciever_balnce: Balance;
	reciever_public_key: string;
	transfer_amount: number;
	transferer_balnce: Balance;
	transferer_public_key: string;
}

interface ChainBlock {
	data: Data;
	hash: string;
	previous_hash: string;
	timestamp: number;
}

interface ChainResponse {
	chain: ChainBlock[];
	state: boolean;
}

const ViewMyChainScreen: React.FC = () => {
	const router = useRouter();
	const [chainData, setChainData] = useState<ChainResponse | null>(null);
	const [showHashes, setShowHashes] = useState<{ [key: number]: boolean }>({});
	const [showReceiverKeys, setShowReceiverKeys] = useState<{ [key: number]: boolean }>({});
	const [showTransfererKeys, setShowTransfererKeys] = useState<{ [key: number]: boolean }>({});
	
	useEffect(() => {
		const fetchChainData = async () => {
			try {
				const walletDataString = await AsyncStorage.getItem('walletData');
				if (!walletDataString) {
					Alert.alert('Error', 'Wallet data not found');
					return;
				}
				const walletData: WalletData = JSON.parse(walletDataString);
				
				const response = await fetch('https://www.blockxserver.xyz/wallet/get_chain', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						public_key: walletData.public_key,
					}),
				});
				
				const data: ChainResponse = await response.json();
				setChainData(data);
			} catch (error) {
				console.error('Failed to fetch chain data:', error);
			}
		};
		
		fetchChainData().catch(() => console.error('Failed to fetch chain data'));
	}, []);
	
	if (!chainData) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-50">
				<ActivityIndicator size="large" color="#0000ff"/>
			</View>
		);
	}
	
	const toggleVisibility = (index: number, type: 'hash' | 'receiver' | 'transferer') => {
		if (type === 'hash') {
			setShowHashes((prev) => ({...prev, [index]: !prev[index]}));
		} else if (type === 'receiver') {
			setShowReceiverKeys((prev) => ({...prev, [index]: !prev[index]}));
		} else {
			setShowTransfererKeys((prev) => ({...prev, [index]: !prev[index]}));
		}
	};
	
	const renderItem = ({item, index}: { item: ChainBlock; index: number }) => (
		<View key={index} className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-300">
			<View className="flex-row items-center mb-4">
				<Ionicons name="link-outline" size={24} color="gray"/>
				<Text className="text-xl font-bold ml-2">Block #{index + 1}</Text>
			</View>
			<View className="mb-2 flex-row justify-between items-center">
				<Text className="font-semibold">Hash:</Text>
				<View className="flex-row items-center flex-1 ml-2">
					<Text className="text-gray-700 flex-1" numberOfLines={1} ellipsizeMode="tail">
						{showHashes[index] ? item.hash : '••••••••••••'}
					</Text>
					<TouchableOpacity onPress={() => toggleVisibility(index, 'hash')}>
						<Ionicons name={showHashes[index] ? "eye-off" : "eye"} size={20} color="gray"/>
					</TouchableOpacity>
				</View>
			</View>
			<View className="mb-2 flex-row justify-between items-center">
				<Text className="font-semibold">Previous Hash:</Text>
				<View className="flex-row items-center flex-1 ml-2">
					<Text className="text-gray-700 flex-1" numberOfLines={1} ellipsizeMode="tail">
						{showHashes[index] ? item.previous_hash : '••••••••••••'}
					</Text>
					<TouchableOpacity onPress={() => toggleVisibility(index, 'hash')}>
						<Ionicons name={showHashes[index] ? "eye-off" : "eye"} size={20} color="gray"/>
					</TouchableOpacity>
				</View>
			</View>
			<View className="mb-2 flex-row justify-between">
				<Text className="font-semibold">Timestamp:</Text>
				<Text className="text-gray-700">{new Date(item.timestamp * 1000).toLocaleString()}</Text>
			</View>
			<View className="mb-2 flex-row justify-between">
				<Text className="font-semibold">Transfer Amount:</Text>
				<Text className="text-gray-700">{item.data.transfer_amount}</Text>
			</View>
			<View className="mb-2 flex-row justify-between items-center">
				<Text className="font-semibold">Receiver Public Key:</Text>
				<View className="flex-row items-center flex-1 ml-2">
					<Text className="text-gray-700 flex-1" numberOfLines={1} ellipsizeMode="tail">
						{showReceiverKeys[index] ? item.data.reciever_public_key : '••••••••••••'}
					</Text>
					<TouchableOpacity onPress={() => toggleVisibility(index, 'receiver')}>
						<Ionicons name={showReceiverKeys[index] ? "eye-off" : "eye"} size={20} color="gray"/>
					</TouchableOpacity>
				</View>
			</View>
			<View className="mb-2 flex-row justify-between">
				<Text className="font-semibold">Receiver Balance - Donated:</Text>
				<Text className="text-gray-700">{item.data.reciever_balnce.donated}</Text>
			</View>
			<View className="mb-2 flex-row justify-between">
				<Text className="font-semibold">Receiver Balance - Minted:</Text>
				<Text className="text-gray-700">{item.data.reciever_balnce.minted}</Text>
			</View>
			<View className="mb-2 flex-row justify-between items-center">
				<Text className="font-semibold">Transferer Public Key:</Text>
				<View className="flex-row items-center flex-1 ml-2">
					<Text className="text-gray-700 flex-1" numberOfLines={1} ellipsizeMode="tail">
						{showTransfererKeys[index] ? item.data.transferer_public_key : '••••••••••••'}
					</Text>
					<TouchableOpacity onPress={() => toggleVisibility(index, 'transferer')}>
						<Ionicons name={showTransfererKeys[index] ? "eye-off" : "eye"} size={20} color="gray"/>
					</TouchableOpacity>
				</View>
			</View>
			<View className="mb-2 flex-row justify-between">
				<Text className="font-semibold">Transferer Balance - Donated:</Text>
				<Text className="text-gray-700">{item.data.transferer_balnce.donated}</Text>
			</View>
			<View className="mb-2 flex-row justify-between">
				<Text className="font-semibold">Transferer Balance - Minted:</Text>
				<Text className="text-gray-700">{item.data.transferer_balnce.minted}</Text>
			</View>
		</View>
	);
	
	return (
		<View className="flex-1 bg-gray-50">
			{/* Header Bar */}
			<View className="flex-row justify-between items-center bg-white px-4 py-5 mt-4 shadow-md">
				<Ionicons name="arrow-back" size={24} color="black" onPress={() => router.back()}/>
				<Text className="text-xl font-bold text-gray-900">My Chain</Text>
				<Ionicons name="notifications" size={24} color="black"/>
			</View>
			
			<FlatList
				showsVerticalScrollIndicator={false}
				data={chainData.chain}
				renderItem={renderItem}
				keyExtractor={(item, index) => index.toString() + item.hash}
				contentContainerStyle={{padding: 6}}
			/>
		</View>
	);
};

export default ViewMyChainScreen;
