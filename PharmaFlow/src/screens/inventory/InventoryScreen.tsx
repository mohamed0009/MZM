"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, FlatList, RefreshControl } from "react-native"
import {
  Appbar,
  Searchbar,
  Card,
  Title,
  Paragraph,
  Button,
  ActivityIndicator,
  FAB,
  Chip,
  Text,
} from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

import { medicationService } from "../../services/medicationService"
import type { Medication } from "../../types"
import { colors, spacing } from "../../theme"

export default function InventoryScreen() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const navigation = useNavigation()

  async function fetchMedications() {
    try {
      const data = await medicationService.getAll()
      setMedications(data)
      setFilteredMedications(data)
      setError("")
    } catch (err) {
      setError("Failed to load medications")
      console.error(err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchMedications()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    fetchMedications()
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim() === "") {
      applyFilter(activeFilter, medications)
    } else {
      const filtered = medications.filter(
        (medication) =>
          medication.name.toLowerCase().includes(query.toLowerCase()) ||
          medication.category.toLowerCase().includes(query.toLowerCase()) ||
          medication.manufacturer.toLowerCase().includes(query.toLowerCase()),
      )
      setFilteredMedications(filtered)
    }
  }

  const applyFilter = (filter: string, meds = medications) => {
    setActiveFilter(filter)
    let filtered = [...meds]

    if (filter === "low-stock") {
      filtered = filtered.filter((med) => med.stock < 10)
    } else if (filter === "expiring-soon") {
      const today = new Date()
      const threeMonthsFromNow = new Date()
      threeMonthsFromNow.setMonth(today.getMonth() + 3)

      filtered = filtered.filter((med) => {
        const expiryDate = new Date(med.expiryDate)
        return expiryDate <= threeMonthsFromNow && expiryDate >= today
      })
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (medication) =>
          medication.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medication.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          medication.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredMedications(filtered)
  }

  const renderMedicationItem = ({ item }: { item: Medication }) => {
    const isLowStock = item.stock < 10
    const expiryDate = new Date(item.expiryDate)
    const today = new Date()
    const threeMonthsFromNow = new Date()
    threeMonthsFromNow.setMonth(today.getMonth() + 3)
    const isExpiringSoon = expiryDate <= threeMonthsFromNow && expiryDate >= today

    return (
      <Card style={styles.medicationCard} onPress={() => navigation.navigate("MedicationDetail", { id: item.id })}>
        <Card.Content>
          <View style={styles.medicationHeader}>
            <Title style={styles.medicationTitle}>{item.name}</Title>
            <View style={styles.stockContainer}>
              <Text style={[styles.stockText, isLowStock && styles.lowStockText]}>Stock: {item.stock}</Text>
            </View>
          </View>

          <Paragraph style={styles.medicationCategory}>{item.category}</Paragraph>

          <View style={styles.medicationDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="business" size={16} color={colors.text} />
              <Text style={styles.detailText}>{item.manufacturer}</Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="calendar" size={16} color={colors.text} />
              <Text style={[styles.detailText, isExpiringSoon && styles.expiringSoonText]}>
                Exp: {new Date(item.expiryDate).toLocaleDateString()}
              </Text>
            </View>
          </View>

          <View style={styles.tagsContainer}>
            {isLowStock && (
              <Chip style={[styles.chip, styles.lowStockChip]} textStyle={styles.chipText} icon="alert-circle">
                Low Stock
              </Chip>
            )}
            {isExpiringSoon && (
              <Chip style={[styles.chip, styles.expiringSoonChip]} textStyle={styles.chipText} icon="calendar-alert">
                Expiring Soon
              </Chip>
            )}
          </View>
        </Card.Content>
      </Card>
    )
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
        <Appbar.Content title="Inventory" />
        <Appbar.Action icon="filter" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search medications..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.filtersContainer}>
        <Chip selected={activeFilter === "all"} onPress={() => applyFilter("all")} style={styles.filterChip}>
          All
        </Chip>
        <Chip
          selected={activeFilter === "low-stock"}
          onPress={() => applyFilter("low-stock")}
          style={styles.filterChip}
        >
          Low Stock
        </Chip>
        <Chip
          selected={activeFilter === "expiring-soon"}
          onPress={() => applyFilter("expiring-soon")}
          style={styles.filterChip}
        >
          Expiring Soon
        </Chip>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={fetchMedications} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredMedications}
            renderItem={renderMedicationItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="medkit" size={48} color={colors.disabled} />
                <Text style={styles.emptyText}>No medications found</Text>
              </View>
            }
          />

          <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate("AddMedication")} />
        </>
      )}
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
  searchContainer: {
    padding: spacing.m,
    backgroundColor: colors.surface,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: colors.background,
  },
  filtersContainer: {
    flexDirection: "row",
    padding: spacing.m,
    backgroundColor: colors.surface,
  },
  filterChip: {
    marginRight: spacing.s,
  },
  listContent: {
    padding: spacing.m,
  },
  medicationCard: {
    marginBottom: spacing.m,
  },
  medicationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  medicationTitle: {
    flex: 1,
    fontSize: 18,
  },
  stockContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 14,
  },
  lowStockText: {
    color: colors.error,
  },
  medicationCategory: {
    color: colors.primary,
    marginBottom: spacing.s,
  },
  medicationDetails: {
    marginBottom: spacing.s,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    marginLeft: spacing.xs,
    fontSize: 14,
    color: colors.text,
  },
  expiringSoonText: {
    color: colors.warning,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.xs,
  },
  chip: {
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipText: {
    fontSize: 12,
  },
  lowStockChip: {
    backgroundColor: `${colors.error}20`,
  },
  expiringSoonChip: {
    backgroundColor: `${colors.warning}20`,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.l,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.m,
    textAlign: "center",
  },
  retryButton: {
    marginTop: spacing.m,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  emptyText: {
    color: colors.disabled,
    marginTop: spacing.m,
    fontSize: 16,
    textAlign: "center",
  },
})
