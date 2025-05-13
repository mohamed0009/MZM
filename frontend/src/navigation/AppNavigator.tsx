"use client"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"

import { useAuth } from "../contexts/AuthContext"
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"
import DashboardScreen from "../screens/dashboard/DashboardScreen"
import InventoryScreen from "../screens/inventory/InventoryScreen"
import MedicationDetailScreen from "../screens/inventory/MedicationDetailScreen"
import AddMedicationScreen from "../screens/inventory/AddMedicationScreen"
import ClientsScreen from "../screens/clients/ClientsScreen"
import ClientDetailScreen from "../screens/clients/ClientDetailScreen"
import AddClientScreen from "../screens/clients/AddClientScreen"
import AlertsScreen from "../screens/alerts/AlertsScreen"
import CalendarScreen from "../screens/calendar/CalendarScreen"
import ProfileScreen from "../screens/profile/ProfileScreen"
import SettingsScreen from "../screens/settings/SettingsScreen"
import DrawerContent from "../components/DrawerContent"
import { colors } from "../theme"

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  )
}

function InventoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="InventoryList" component={InventoryScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="MedicationDetail"
        component={MedicationDetailScreen}
        options={{ title: "Medication Details" }}
      />
      <Stack.Screen name="AddMedication" component={AddMedicationScreen} options={{ title: "Add Medication" }} />
    </Stack.Navigator>
  )
}

function ClientsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ClientsList" component={ClientsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ClientDetail" component={ClientDetailScreen} options={{ title: "Client Details" }} />
      <Stack.Screen name="AddClient" component={AddClientScreen} options={{ title: "Add Client" }} />
    </Stack.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Inventory") {
            iconName = focused ? "medkit" : "medkit-outline"
          } else if (route.name === "Clients") {
            iconName = focused ? "people" : "people-outline"
          } else if (route.name === "Alerts") {
            iconName = focused ? "notifications" : "notifications-outline"
          } else if (route.name === "Calendar") {
            iconName = focused ? "calendar" : "calendar-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.disabled,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Inventory" component={InventoryStack} />
      <Tab.Screen name="Clients" component={ClientsStack} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
    </Tab.Navigator>
  )
}

function MainDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: colors.primary,
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: colors.text,
      }}
    >
      <Drawer.Screen name="MainTabs" component={MainTabs} options={{ title: "Home" }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    // Vous pourriez ajouter un écran de chargement ici
    return null
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? <Stack.Screen name="Main" component={MainDrawer} /> : <Stack.Screen name="Auth" component={AuthStack} />}
    </Stack.Navigator>
  )
}
