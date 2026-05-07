import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import "../lib/sentry";

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="discover" options={{ title: 'Discover' }} />
      <Tab.Screen name="browse" options={{ title: 'Browse' }} />
      <Tab.Screen name="compare" options={{ title: 'Compare' }} />
      <Tab.Screen name="profile" options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}