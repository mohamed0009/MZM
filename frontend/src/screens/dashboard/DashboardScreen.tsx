"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native"
import { Text, Card, Title, Paragraph, Appbar, ActivityIndicator, Button } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { LineChart } from "react-native-chart-kit"
import { Dimensions } from "react-native"

import { dashboardService } from "../../services/dashboardService"
import type { DashboardStats } from "../../types"
import { colors, spacing } from "../../theme"
import AlertItem from "../../components/AlertItem"

const screenWidth = Dimensions.get("window").width

export default function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")
  const navigation = useNavigation()

  async function fetchDashboardData() {
    try {
      const data = await dashboardService.getStats()
      setStats(data)
      setError("")
    } catch (err) {
      setError("Failed to load dashboard data")
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  // Sample data for the chart
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: () => colors.primary,
        strokeWidth: 2,
      },
    ],
  }

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Dashboard" />
        <Appbar.Action icon="bell" onPress={() => navigation.navigate("Alerts")} />
      </Appbar.Header>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {error ? (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.errorText}>{error}</Text>
              <Button mode="contained" onPress={fetchDashboardData} style={styles.retryButton}>
                Retry
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <Card style={styles.statsCard}>
                <Card.Content style={styles.statsCardContent}>
                  <Ionicons name="medkit" size={24} color={colors.primary} />
                  <Title>{stats?.totalMedications || 0}</Title>
                  <Paragraph>Medications</Paragraph>
                </Card.Content>
              </Card>

              <Card style={styles.statsCard}>
                <Card.Content style={styles.statsCardContent}>
                  <Ionicons name="people" size={24} color={colors.primary} />
                  <Title>{stats?.totalClients || 0}</Title>
                  <Paragraph>Clients</Paragraph>
                </Card.Content>
              </Card>

              <Card style={styles.statsCard}>
                <Card.Content style={styles.statsCardContent}>
                  <Ionicons name="warning" size={24} color={colors.warning} />
                  <Title>{stats?.lowStockCount || 0}</Title>
                  <Paragraph>Low Stock</Paragraph>
                </Card.Content>
              </Card>

              <Card style={styles.statsCard}>
                <Card.Content style={styles.statsCardContent}>
                  <Ionicons name="time" size={24} color={colors.error} />
                  <Title>{stats?.expiringMedicationsCount || 0}</Title>
                  <Paragraph>Expiring Soon</Paragraph>
                </Card.Content>
              </Card>
            </View>

            <Card style={styles.chartCard}>
              <Card.Title title="Sales Overview" subtitle="Last 6 months" />
              <Card.Content>
                <LineChart
                  data={chartData}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: colors.surface,
                    backgroundGradientFrom: colors.surface,
                    backgroundGradientTo: colors.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: colors.primary,
                    },
                  }}
                  bezier
                  style={styles.chart}
                />
              </Card.Content>
            </Card>

            <Card style={styles.alertsCard}>
              <Card.Title
                title="Recent Alerts"
                subtitle="Last 5 alerts"
                right={(props) => (
                  <Button
                    mode="text"
                    onPress={() => navigation.navigate("Alerts")}
                    labelStyle={{ color: colors.primary }}
                  >
                    View All
                  </Button>
                )}
              />
              <Card.Content>
                {stats?.recentAlerts && stats.recentAlerts.length > 0 ? (
                  stats.recentAlerts.map((alert) => <AlertItem key={alert.id} alert={alert} />)
                ) : (
                  <Text style={styles.noDataText}>No recent alerts</Text>
                )}
              </Card.Content>
            </Card>

            <Card style={styles.eventsCard}>
              <Card.Title
                title="Upcoming Events"
                subtitle="Next 5 events"
                right={(props) => (
                  <Button
                    mode="text"
                    onPress={() => navigation.navigate("Calendar")}
                    labelStyle={{ color: colors.primary }}
                  >
                    View All
                  </Button>
                )}
              />
              <Card.Content>
                {stats?.upcomingEvents && stats.upcomingEvents.length > 0 ? (
                  stats.upcomingEvents.map((event) => (
                    <View key={event.id} style={styles.eventItem}>
                      <View style={styles.eventIconContainer}>
                        <Ionicons
                          name={event.type === "MEETING" ? "people" : event.type === "REMINDER" ? "alarm" : "cube"}
                          size={20}
                          color={colors.primary}
                        />
                      </View>
                      <View style={styles.eventContent}>
                        <Text style={styles.eventTitle}>{event.title}</Text>
                        <Text style={styles.eventDate}>{new Date(event.startDate).toLocaleDateString()}</Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noDataText}>No upcoming events</Text>
                )}
              </Card.Content>
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.m,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.m,
  },
  statsCard: {
    width: "48%",
    marginBottom: spacing.m,
  },
  statsCardContent: {
    alignItems: "center",
    padding: spacing.s,
  },
  chartCard: {
    marginBottom: spacing.m,
  },
  chart: {
    marginVertical: spacing.m,
    borderRadius: 16,
  },
  alertsCard: {
    marginBottom: spacing.m,
  },
  eventsCard: {
    marginBottom: spacing.m,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.m,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  eventDate: {
    color: colors.text,
    opacity: 0.7,
  },
  errorCard: {
    marginBottom: spacing.m,
    backgroundColor: `${colors.error}10`,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.m,
  },
  retryButton: {
    alignSelf: "center",
  },
  noDataText: {
    textAlign: "center",
    color: colors.disabled,
    padding: spacing.m,
  },
})
