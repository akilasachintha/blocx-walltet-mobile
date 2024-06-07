import {useRouter} from 'expo-router';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesome5, Ionicons} from '@expo/vector-icons';

export default function AccountDetailsScreen() {
	const router = useRouter();
	
	return (
		<View className="flex-1 bg-gray-50">
			<View className="flex-row justify-between items-center bg-white px-4 py-5 mt-4 shadow-md">
				<Ionicons name="menu" size={24} color="black"/>
				<Text className="text-xl font-bold text-gray-900">DeFi Wallet</Text>
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
						<View className="ml-4">
							<Text className="text-xl font-bold text-gray-900">DeFi Wallet</Text>
							<Text className="text-sm text-gray-500">0xDe9...62F5</Text>
						</View>
					</View>
					
					<View className="space-y-2">
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Account ID: </Text>234804-4242282-sdfs34-423uoS
						</Text>
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Balances: </Text>1.2 ETH
						</Text>
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Minted: </Text>5 Tokens
						</Text>
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Donated: </Text>3 Tokens
						</Text>
						<Text className="text-base text-gray-700">
							<Text className="font-semibold">Requests: </Text>2 Pending
						</Text>
					</View>
				</View>
				
				{/* Action Buttons */}
				<View className="w-full flex-1 bg-white rounded-lg shadow-lg p-3">
					<View className="flex-row justify-around mt-6 gap-2">
						<TouchableOpacity
							className="flex-1 py-3 bg-blue-600 rounded-lg flex justify-center items-center shadow-md"
							onPress={() => router.push('/main/requests/RequestsScreen')}
						>
							<FontAwesome5 name="eye" size={20} color="white"/>
							<Text className="text-md text-white mt-2">View Requests</Text>
						</TouchableOpacity>
						
						<TouchableOpacity
							className="flex-1 bg-green-600 rounded-lg flex justify-center items-center shadow-md"
							onPress={() => router.push('/main/SendTokenScreen')}
						>
							<FontAwesome5 name="paper-plane" size={20} color="white"/>
							<Text className="text-md text-white mt-2">Send Token</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
}
