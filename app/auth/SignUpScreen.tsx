import {Stack, useRouter} from 'expo-router';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';

export default function SignUpScreen() {
	const router = useRouter();
	
	return (
		<>
			<Stack.Screen options={{title: 'Login'}}/>
			<View className="flex-1 items-center justify-center p-5">
				<Text className="text-2xl font-bold mb-8">SignUp</Text>
				
				<View className="w-full max-w-md space-y-4">
					<View className="w-full">
						<Text className="text-base mb-2">Email:</Text>
						<TextInput
							className="border-b border-gray-300 dark:border-gray-600 py-2"
							placeholder="Enter your email"
							keyboardType="email-address"
							autoCapitalize="none"
							autoComplete="email"
						/>
					</View>
					
					<TouchableOpacity
						className="mt-4 py-4 bg-blue-500 rounded-lg flex justify-center items-center"
						onPress={() => router.push('/main/LoginPrivateKeyScreen')}
					>
						<Text className="text-base text-white text-center">Sign Up</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
}
