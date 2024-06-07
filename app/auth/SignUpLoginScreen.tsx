import { Stack, useRouter } from 'expo-router';
import { Text, View, TouchableOpacity } from 'react-native';

export default function SignUpLoginScreen() {
	const router = useRouter();
	
	return (
		<>
			<Stack.Screen options={{ title: 'Sign Up / Login' }} />
			<View className="flex-1 items-center justify-center p-5">
				<TouchableOpacity
					className="mt-4 py-4 bg-blue-500 rounded-lg w-2/3 flex justify-center items-center"
					onPress={() => router.push('/main/LoginPrivateKeyScreen')}
				>
					<Text className="text-base text-white text-center">Login</Text>
				</TouchableOpacity>
				
				<TouchableOpacity
					className="mt-4 py-4 bg-blue-500 rounded-lg w-2/3 flex justify-center items-center"
					onPress={() => router.push('/auth/SignUpScreen')}
				>
					<Text className="text-base text-white text-center">Sign Up</Text>
				</TouchableOpacity>
			</View>
		</>
	);
}
