import { SymbolView } from 'expo-symbols';
import { Redirect, Tabs } from 'expo-router';
import { useEffect, useState } from 'react';

import { NotificationPermissionPrompt } from '@/components/NotificationPermissionPrompt';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/context/Auth';
import { useGameState } from '@/context/GameState';
import { Colors, OrbitronFonts } from '@/constants/theme';
import { TOTAL_DISCIPLINES } from '@/lib/disciplines';
import {
  configureNotificationHandler,
  getNotificationPermissionStatus,
  hasShownNotificationPrompt,
  markNotificationPromptShown,
  notificationsSupported,
  requestNotificationPermission,
  scheduleMorningNotifications,
  scheduleOrCancelEveningNotification,
} from '@/lib/notifications';

export default function TabLayout() {
  const { user } = useAuth();
  const { doneIds } = useGameState();
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  // First time a signed-in user reaches the main tabs: show our own
  // explanation before the system dialog (if we haven't already, and the
  // OS hasn't already been asked). If permission was already granted in a
  // past session, just top the morning batch back up for this app open.
  useEffect(() => {
    if (!user || !notificationsSupported) return;
    configureNotificationHandler();
    (async () => {
      const [alreadyShown, status] = await Promise.all([
        hasShownNotificationPrompt(),
        getNotificationPermissionStatus(),
      ]);
      if (!alreadyShown && status.status === 'undetermined') {
        setShowNotificationPrompt(true);
        return;
      }
      if (status.granted) {
        await scheduleMorningNotifications();
      }
    })();
  }, [user]);

  // Whenever today's completion state changes, re-evaluate the evening
  // reminder — it's a no-op if permission isn't granted, and cancels
  // itself if today's 21 disciplines are already all done.
  useEffect(() => {
    if (!user || !notificationsSupported) return;
    const doneCount = Object.values(doneIds).filter(Boolean).length;
    scheduleOrCancelEveningNotification(doneCount, TOTAL_DISCIPLINES);
  }, [user, doneIds]);

  const handleEnableNotifications = async () => {
    await markNotificationPromptShown();
    setShowNotificationPrompt(false);
    const result = await requestNotificationPermission();
    if (result.granted) {
      await scheduleMorningNotifications();
      const doneCount = Object.values(doneIds).filter(Boolean).length;
      await scheduleOrCancelEveningNotification(doneCount, TOTAL_DISCIPLINES);
    }
  };

  const handleDismissNotificationPrompt = async () => {
    await markNotificationPromptShown();
    setShowNotificationPrompt(false);
  };

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <>
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
      {showNotificationPrompt && (
        <NotificationPermissionPrompt
          onEnable={handleEnableNotifications}
          onDismiss={handleDismissNotificationPrompt}
        />
      )}
    </>
  );
}
