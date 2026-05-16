import { useEffect, useMemo, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import DashboardScreen from './src/screens/DashboardScreen';
import TradeControllerScreen from './src/screens/TradeControllerScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { supabase } from './src/lib/supabase';
import { ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscription = supabase
      .channel('connection-status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'account_metrics' }, () => {
        setConnected(true);
      })
      .subscribe();

    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('account_metrics').select('id').limit(1);
        if (!error && data) {
          setConnected(true);
        }
      } catch (err) {
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkConnection();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const theme = useMemo(
    () => ({
      ...(DarkTheme as object),
      colors: {
        ...(DarkTheme as any).colors,
        background: '#060E1A',
        card: '#0F1728',
        text: '#F8FAFC',
        border: '#1E293B',
      },
    }),
    []
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#060E1A' }}>
        <ActivityIndicator size="large" color="#38BDF8" />
        <Text style={{ color: '#CBD5E1', marginTop: 16 }}>Initializing dashboard...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={theme}>
      <StatusBar style="light" />
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Trade" component={TradeControllerScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
