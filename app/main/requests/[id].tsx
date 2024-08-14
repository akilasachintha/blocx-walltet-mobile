import React, {useState} from 'react';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

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
}

const RequestDetailsScreen: React.FC = () => {
	const router = useRouter();
	const {request} = useLocalSearchParams();
	const requestData: Request = JSON.parse(request as string);
	const [showFullPublicKey, setShowFullPublicKey] = useState<boolean>(false);
	
	return (
		<ScrollView className="flex-1 bg-gray-50">
			{/* Header Bar */}
			<View className="flex-row justify-between items-center bg-white px-4 py-5 mt-4 shadow-md">
				<Ionicons name="arrow-back" size={24} color="black" onPress={() => router.back()}/>
				<Text className="text-xl font-bold text-gray-900">Request Details</Text>
				<Ionicons name="notifications" size={24} color="black"/>
			</View>
			
			<View className="flex-1 items-center justify-start p-6">
				<View className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-6">
					<View className="space-y-4">
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Post Grade: </Text>{requestData.post_grade}
						</Text>
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">User Score: </Text>{requestData.user_score}
						</Text>
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Time Stamp: </Text>{requestData.time_stamp}
						</Text>
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Expire
								Time: </Text>{new Date(requestData.expire_time * 1000).toLocaleString()}
						</Text>
						<View className="flex-row items-center text-base text-gray-700">
							<Text className="font-semibold">User Public Key: </Text>
							<Text className="flex-1">
								{showFullPublicKey ? requestData.user_public_key : `${requestData.user_public_key.slice(0, 10)}...${requestData.user_public_key.slice(-4)}`}
							</Text>
							<TouchableOpacity onPress={() => setShowFullPublicKey(!showFullPublicKey)}>
								<Ionicons name={showFullPublicKey ? "eye" : "eye-off"} size={20} color="gray"/>
							</TouchableOpacity>
						</View>
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Comments Level: </Text>
						</Text>
						<View className="w-full">
							<View className="flex-row justify-between border-b-2 border-gray-300 py-2">
								<Text className="font-semibold text-gray-700 w-1/4">Level</Text>
								<Text className="font-semibold text-gray-700 text-center w-1/4">Average</Text>
								<Text className="font-semibold text-gray-700 text-center w-1/4">Comments</Text>
								<Text className="font-semibold text-gray-700 text-center w-1/4">Total Score</Text>
							</View>
							{Object.keys(requestData.comment_level).map(level => (
								<View key={level} className="flex-row justify-between border-b border-gray-200 py-2">
									<Text className="text-gray-700 w-1/4">{level}</Text>
									<Text
										className="text-gray-700 text-center w-1/4">{requestData.comment_level[level].average}</Text>
									<Text
										className="text-gray-700 text-center w-1/4">{requestData.comment_level[level].comments}</Text>
									<Text
										className="text-gray-700 text-center w-1/4">{requestData.comment_level[level].total_score}</Text>
								</View>
							))}
						</View>
					</View>
					
					<TouchableOpacity
						className="mt-8 py-3 px-6 bg-blue-600 rounded-lg flex justify-center items-center shadow-md"
						onPress={() => router.push({
							pathname: '/main/SendTokenScreen',
							params: {userPublicKey: requestData.user_public_key, requestId: requestData?.id}
						})}
					>
						<Text className="text-lg text-white text-center">Send Token</Text>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	);
};

export default RequestDetailsScreen;
