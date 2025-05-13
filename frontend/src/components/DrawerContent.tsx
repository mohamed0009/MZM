"use client"

import React from "react"
import { View, StyleSheet } from "react-native"
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer"
import { Drawer, Text, Avatar, Divider, Switch } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../contexts/AuthContext"
import { colors, spacing } from "../theme"

export default function DrawerContent(props) {
  const { user, signOut } = useAuth()
  const [isDarkTheme, setIsDarkTheme] = React.useState(false)

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
    // Implement theme switching logic here
  }

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <View style={styles.userInfo}>
            <Avatar.Image
              source={{
                uri: "https://ui-avatars.com/api/?name=" + user?.firstName + "+" + user?.lastName,
              }}
              size={50}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={styles.userRole}>{user?.role}</Text>
            </View>
          </View>
        </View>

        <Divider style={styles.divider} />

        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />}
            label="Dashboard"
            onPress={() => props.navigation.navigate("MainTabs")}
          />
          <DrawerItem
            icon={({ color, size }) => <Ionicons name="medkit-outline" color={color} size={size} />}
            label="Inventory"
            onPress={() => props.navigation.navigate("Inventory")}
          />
          <DrawerItem
            icon={({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />}
            label="Clients"
            onPress={() => props.navigation.navigate("Clients")}
          />
          <DrawerItem
            icon={({ color, size }) => <Ionicons name="notifications-outline" color={color} size={size} />}
            label="Alerts"
            onPress={() => props.navigation.navigate("Alerts")}
          />
          <DrawerItem
            icon={({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} />}
            label="Calendar"
            onPress={() => props.navigation.navigate("Calendar")}
          />
        </Drawer.Section>

        <Divider style={styles.divider} />

        <Drawer.Section title="Preferences">
          <View style={styles.preference}>
            <Text>Dark Theme</Text>
            <Switch value={isDarkTheme} onValueChange={toggleTheme} />
          </View>
        </Drawer.Section>

        <Divider style={styles.divider} />

        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />}
            label="Profile"
            onPress={() => props.navigation.navigate("Profile")}
          />
          <DrawerItem
            icon={({ color, size }) => <Ionicons name="settings-outline" color={color} size={size} />}
            label="Settings"
            onPress={() => props.navigation.navigate("Settings")}
          />
          <DrawerItem
            icon={({ color, size }) => <Ionicons name="log-out-outline" color={color} size={size} />}
            label="Sign Out"
            onPress={() => signOut()}
          />
        </Drawer.Section>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>PharmaSys v1.0.0</Text>
        </View>
      </View>
    </DrawerContentScrollView>
  )
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: spacing.m,
    paddingRight: spacing.m,
    paddingTop: spacing.l,
    paddingBottom: spacing.m,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userDetails: {
    marginLeft: spacing.m,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
  },
  userRole: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
  },
  divider: {
    marginVertical: spacing.xs,
  },
  drawerSection: {
    marginTop: spacing.xs,
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.m,
  },
  versionText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.5,
  },
})
