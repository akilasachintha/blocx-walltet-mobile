import React, {useEffect, useState} from 'react';
import {useRouter} from 'expo-router';
import {ActivityIndicator, Alert, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CommentLevel {
	Neutral: {
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
}

export interface WalletData {
	public_key: string;
}

const RequestsScreen: React.FC = () => {
	const router = useRouter();
	const [requests, setRequests] = useState<Request[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	
	useEffect(() => {
		const fetchRequests = async () => {
			try {
				const walletDataString = await AsyncStorage.getItem('walletData');
				if (!walletDataString) {
					Alert.alert('Error', 'Wallet data not found');
					return;
				}
				const walletData: WalletData = JSON.parse(walletDataString);
				const response = await axios.post<Request[]>('https://www.blockxserver.xyz/wallet/get_validation_requests', {
					public_key: walletData.public_key,
				});
				setRequests(response.data);
			} catch (error) {
				console.error('Failed to fetch requests', error);
				Alert.alert('Error', 'Failed to fetch requests');
			} finally {
				setLoading(false);
			}
		};
		
		fetchRequests().catch(() => {
		});
	}, []);
	
	if (loading) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-50">
				<ActivityIndicator size="large" color="#0000ff"/>
			</View>
		);
	}
	
	return (
		<View className="flex-1 bg-gray-50">
			{/* Header Bar */}
			<View className="flex-row justify-between items-center bg-white px-4 py-5 mt-4 shadow-md">
				<Ionicons name="arrow-back" size={24} color="black" onPress={() => router.back()}/>
				<Text className="text-xl font-bold text-gray-900">Requests</Text>
				<Ionicons name="notifications" size={24} color="black"/>
			</View>
			
			<View className="flex-1 items-center justify-start p-6">
				<View className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-6">
					<View className="space-y-4">
						{requests.map((request, index) => (
							<TouchableOpacity
								key={request.id}
								className="border flex-row border-gray-300 p-4 rounded-lg w-full flex justify-between items-center shadow-sm"
								onPress={() =>
									router.push({
										pathname: `/main/validationRequests/${request.id}`,
										params: {request: JSON.stringify(request)},
									})
								}
							>
								<Text className="text-base text-gray-800">Request {index + 1}</Text>
								<Ionicons name="chevron-forward" size={20} color="gray"/>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</View>
		</View>
	);
};

export default RequestsScreen;
