import { SymbolView } from 'expo-symbols';
import { Redirect, Tabs } from 'expo-router';

import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/context/Auth';
import { Colors, OrbitronFonts } from '@/constants/theme';

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.cyan,
        tabBarInactiveTintColor: Colors.inkDim,
        tabBarStyle: { backgroundColor: Colors.panel, borderTopColor: Colors.border },
        tabBarLabelStyle: { fontFamily: OrbitronFonts.medium, fontSize: 10 },
        headerStyle: { backgroundColor: Colors.panel },
        headerTintColor: Colors.ink,
        headerTitleStyle: { fontFamily: OrbitronFonts.semiBold, fontSize: 15 },
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'The Charge',
          tabBarLabel: 'Charge',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'checklist',
                android: 'checklist',
                web: 'checklist',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chronicle"
        options={{
          title: 'Chronicle',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'book.fill',
                android: 'book',
                web: 'book',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Record of Deeds',
          tabBarLabel: 'Progress',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'chart.bar.fill',
                android: 'bar_chart',
                web: 'bar_chart',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: 'The Order',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'crown.fill',
                android: 'military_tech',
                web: 'military_tech',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="armory"
        options={{
          title: 'The Armory',
          tabBarLabel: 'Armory',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'shield.fill',
                android: 'shield',
                web: 'shield',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
}
