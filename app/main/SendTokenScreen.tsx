import {useRouter} from 'expo-router';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function SendTokenScreen() {
	const router = useRouter();
	
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
							<TextInput
								className="border-b border-gray-300 dark:border-gray-600 py-2"
								placeholder="Enter account ID"
								autoCapitalize="none"
								autoComplete="off"
							/>
						</View>
						
						<View className="w-full">
							<Text className="text-base mb-2 text-gray-700">Receiver Account:</Text>
							<TextInput
								className="border-b border-gray-300 dark:border-gray-600 py-2"
								placeholder="Enter receiver account"
								autoCapitalize="none"
								autoComplete="off"
							/>
						</View>
						
						<View className="w-full">
							<Text className="text-base mb-2 text-gray-700">Amount:</Text>
							<TextInput
								className="border-b border-gray-300 dark:border-gray-600 py-2"
								placeholder="Enter amount"
								keyboardType="numeric"
								autoCapitalize="none"
								autoComplete="off"
							/>
						</View>
						
						<TouchableOpacity
							className="mt-4 py-4 bg-blue-600 rounded-lg flex justify-center items-center shadow-md"
							onPress={() => router.push('/')}
						>
							<Text className="text-base text-white text-center">Send</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
}
