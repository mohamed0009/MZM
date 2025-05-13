"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { prescriptions } from "./data"

interface AnalyticsDashboardProps {
  data?: any[]
}

export function AnalyticsDashboard({ data = [] }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={prescriptions} />
        </CardContent>
      </Card>
    </div>
  )
} 