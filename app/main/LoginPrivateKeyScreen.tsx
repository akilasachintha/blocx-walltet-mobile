import {useRouter} from 'expo-router';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';

export default function LoginPrivateKeyScreen() {
	const router = useRouter();
	
	return (
		<>
			<View className="flex-1 items-center justify-center p-5">
				<Text className="text-2xl font-bold mb-8">Login with Private Key</Text>
				
				<View className="w-full max-w-md space-y-4">
					<View className="w-full">
						<TextInput
							className="border-b border-gray-300 dark:border-gray-600 py-2"
							placeholder="Enter your private key"
							secureTextEntry
							autoCapitalize="none"
							autoComplete="password"
						/>
					</View>
					
					<TouchableOpacity
						className="mt-4 py-4 bg-blue-500 rounded-lg flex justify-center items-center"
						onPress={() => router.push('')}
					>
						<Text className="text-base text-white text-center">Login</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
}
