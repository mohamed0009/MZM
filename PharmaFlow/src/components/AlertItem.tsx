import type React from "react"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { Text } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import type { Alert as AlertType } from "../types"
import { colors, spacing } from "../theme"

interface AlertItemProps {
  alert: AlertType
  onPress?: () => void
}

const AlertItem: React.FC<AlertItemProps> = ({ alert, onPress }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return colors.error
      case "MEDIUM":
        return colors.warning
      case "LOW":
        return colors.info
      default:
        return colors.text
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "INVENTORY":
        return "medkit"
      case "CLIENT":
        return "people"
      case "SYSTEM":
        return "settings"
      default:
        return "alert-circle"
    }
  }

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${getPriorityColor(alert.priority)}20` }]}>
        <Ionicons name={getCategoryIcon(alert.category)} size={20} color={getPriorityColor(alert.priority)} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{alert.title}</Text>
        <Text style={styles.message} numberOfLines={2}>
          {alert.message}
        </Text>
        <Text style={styles.date}>{new Date(alert.createdAt).toLocaleString()}</Text>
      </View>
      {!alert.isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
    backgroundColor: colors.surface,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.m,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  message: {
    color: colors.text,
    opacity: 0.7,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.5,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    alignSelf: "center",
    marginLeft: spacing.s,
  },
})

export default AlertItem
