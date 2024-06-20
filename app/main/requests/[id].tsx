import React from 'react';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

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

const RequestDetailsScreen: React.FC = () => {
	const router = useRouter();
	const {request} = useLocalSearchParams();
	const requestData: Request = JSON.parse(request as string);
	
	return (
		<View className="flex-1 bg-gray-50">
			{/* Header Bar */}
			<View className="flex-row justify-between items-center bg-white px-4 py-5 mt-4 shadow-md">
				<Ionicons name="arrow-back" size={24} color="black" onPress={() => router.back()}/>
				<Text className="text-xl font-bold text-gray-900">Request Details</Text>
				<Ionicons name="notifications" size={24} color="black"/>
			</View>
			
			<View className="flex-1 items-center justify-start p-6">
				<View className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-6">
					<View className="space-y-4">
						<Text className="text-2xl font-bold text-gray-900">Request Details</Text>
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
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">User Public Key: </Text>{requestData.user_public_key}
						</Text>
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Comments Level: </Text>
						</Text>
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Average: </Text>{requestData.comment_level.Neutral.average}
						</Text>
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Total
								Comments: </Text>{requestData.comment_level.Neutral.comments}
						</Text>
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Total
								Score: </Text>{requestData.comment_level.Neutral.total_score}
						</Text>
					</View>
					
					<TouchableOpacity
						className="mt-8 py-3 px-6 bg-blue-600 rounded-lg flex justify-center items-center shadow-md"
						onPress={() => router.push('/main/SendTokenScreen')}
					>
						<Text className="text-lg text-white text-center">Send Token</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default RequestDetailsScreen;
