import {useRouter} from 'expo-router';
import {Text, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function RequestsScreen() {
	const router = useRouter();
	const requests = [
		{id: 1, name: 'Request 1'},
		{id: 2, name: 'Request 2'},
	];
	
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
					<Text className="text-2xl font-bold mb-8 text-gray-900">Requests</Text>
					<View className="space-y-4">
						{requests.map((request) => (
							<TouchableOpacity
								key={request.id}
								className="border flex-row border-gray-300 p-4 rounded-lg w-full flex justify-between items-center shadow-sm"
								onPress={() => router.push(`/main/requests/${request.id}`)}
							>
								<Text className="text-base text-gray-800">{request.name}</Text>
								<Ionicons name="chevron-forward" size={20} color="gray"/>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</View>
		</View>
	);
}
