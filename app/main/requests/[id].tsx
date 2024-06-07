import {useLocalSearchParams, useRouter} from 'expo-router';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function RequestDetailsScreen() {
	const router = useRouter();
	const {id} = useLocalSearchParams();
	
	return (
		<View className="flex-1 bg-gray-50">
			<View className="flex-row justify-between items-center bg-white px-4 py-5 mt-4 shadow-md">
				<Ionicons name="arrow-back" size={24} color="black" onPress={() => router.back()}/>
				<Text className="text-xl font-bold text-gray-900">Request {id} Details</Text>
				<Ionicons name="notifications" size={24} color="black"/>
			</View>
			
			<View className="flex-1 items-center justify-start p-6">
				<View className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 mb-6">
					<View className="space-y-4">
						<Text className="text-2xl font-bold text-gray-900">Guidance</Text>
						<Text className="text-base text-gray-700">Comments: ...</Text>
						<Text className="text-base text-gray-700">Score: ...</Text>
						<Text className="text-base text-gray-700">Post Score: ...</Text>
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
}
