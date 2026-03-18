import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import QuizScreen from '../screens/QuizScreen';
import SpellingScreen from '../screens/SpellingScreen';
import DailyChallengeScreen from '../screens/DailyChallengeScreen';
import MorseCodeScreen from '../screens/MorseCodeScreen';
import NatoFlashcardsScreen from '../screens/NatoFlashcardsScreen';
import MorseFlashcardsScreen from '../screens/MorseFlashcardsScreen';
import StatsScreen from '../screens/StatsScreen';
import AchievementsScreen from '../screens/AchievementsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { COLORS } from '../constants/theme';

export type HomeStackParamList = {
  Home: undefined;
  Quiz: { mode: 'random' | 'weak'; fullAlphabet?: boolean };
  Spelling: undefined;
  DailyChallenge: undefined;
  MorseCode: undefined;
  NatoFlashcards: undefined;
  MorseFlashcards: undefined;
};

type TabParamList = {
  HomeTab: undefined;
  Stats: undefined;
  Achievements: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Spelling"
        component={SpellingScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="DailyChallenge"
        component={DailyChallengeScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="MorseCode"
        component={MorseCodeScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="NatoFlashcards"
        component={NatoFlashcardsScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="MorseFlashcards"
        component={MorseFlashcardsScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.tabBar,
          borderTopColor: COLORS.cardBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
