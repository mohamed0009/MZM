import { Redirect } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function Index() {
  const token = useSelector((state: RootState) => state.auth.token);
  
  // If user is logged in, redirect to dashboard, otherwise to login
  return token ? <Redirect href="/(tabs)" /> : <Redirect href="/login" />;
} 