"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView, Alert } from "react-native"
import { Appbar, Card, Title, Paragraph, Button, ActivityIndicator, Text, Divider } from "react-native-paper"
import { useNavigation, useRoute } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

import { medicationService } from "../../services/medicationService"
import type { Medication } from "../../types"
import { colors, spacing } from "../../theme"

export default function MedicationDetailScreen() {
  const [medication, setMedication] = useState<Medication | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigation = useNavigation()
  const route = useRoute()
  const { id } = route.params as { id: string }

  async function fetchMedicationDetails() {
    try {
      const data = await medicationService.getById(id)
      setMedication(data)
      setError("")
    } catch (err) {
      setError("Failed to load medication details")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedicationDetails()
  }, [id])

  const handleDelete = () => {
    Alert.alert("Delete Medication", "Are you sure you want to delete this medication? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await medicationService.delete(id)
            navigation.goBack()
          } catch (err) {
            Alert.alert("Error", "Failed to delete medication")
            console.error(err)
          }
        },
      },
    ])
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Medication Details" />
        <Appbar.Action icon="pencil" onPress={() => navigation.navigate("AddMedication", { medication })} />
        <Appbar.Action icon="delete" onPress={handleDelete} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {error ? (
          <Card style={styles.errorCard}>
            <Card.Content>
              <Text style={styles.errorText}>{error}</Text>
              <Button mode="contained" onPress={fetchMedicationDetails} style={styles.retryButton}>
                Retry
              </Button>
            </Card.Content>
          </Card>
        ) : medication ? (
          <>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.title}>{medication.name}</Title>
                <Paragraph style={styles.category}>{medication.category}</Paragraph>

                <View style={styles.stockContainer}>
                  <Text style={styles.stockLabel}>Current Stock:</Text>
                  <Text style={[styles.stockValue, medication.stock < 10 && styles.lowStockText]}>
                    {medication.stock} units
                  </Text>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="business" size={20} color={colors.primary} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Manufacturer</Text>
                      <Text style={styles.detailValue}>{medication.manufacturer}</Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons name="calendar" size={20} color={colors.primary} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Expiry Date</Text>
                      <Text style={styles.detailValue}>{new Date(medication.expiryDate).toLocaleDateString()}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Ionicons name="cash" size={20} color={colors.primary} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Price</Text>
                      <Text style={styles.detailValue}>${medication.price.toFixed(2)}</Text>
                    </View>
                  </View>

                  <View style={styles.detailItem}>
                    <Ionicons name="flask" size={20} color={colors.primary} />
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Dosage</Text>
                      <Text style={styles.detailValue}>{medication.dosage}</Text>
                    </View>
                  </View>
                </View>

                <Divider style={styles.divider} />

                <Text style={styles.descriptionLabel}>Description</Text>
                <Text style={styles.description}>{medication.description}</Text>
              </Card.Content>
            </Card>

            <View style={styles.actionsContainer}>
              <Button
                mode="contained"
                icon="pencil"
                onPress={() => navigation.navigate("AddMedication", { medication })}
                style={styles.actionButton}
              >
                Edit Medication
              </Button>
              <Button
                mode="outlined"
                icon="delete"
                onPress={handleDelete}
                style={styles.actionButton}
                buttonColor={`${colors.error}10`}
                textColor={colors.error}
              >
                Delete Medication
              </Button>
            </View>
          </>
        ) : (
          <Text style={styles.notFoundText}>Medication not found</Text>
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
  card: {
    marginBottom: spacing.m,
  },
  title: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  category: {
    color: colors.primary,
    marginBottom: spacing.m,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.m,
  },
  stockLabel: {
    fontSize: 16,
    marginRight: spacing.s,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lowStockText: {
    color: colors.error,
  },
  divider: {
    marginVertical: spacing.m,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.m,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  detailTextContainer: {
    marginLeft: spacing.s,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 16,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: spacing.s,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  actionsContainer: {
    marginTop: spacing.m,
  },
  actionButton: {
    marginBottom: spacing.m,
  },
  errorCard: {
    marginBottom: spacing.m,
    backgroundColor: `${colors.error}10`,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.m,
    textAlign: "center",
  },
  retryButton: {
    alignSelf: "center",
  },
  notFoundText: {
    textAlign: "center",
    fontSize: 16,
    color: colors.disabled,
    marginTop: spacing.xl,
  },
})
