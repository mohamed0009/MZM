"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface OverviewProps {
  data?: {
    labels: string[]
    data: number[]
  }
}

// Default data for when the data prop is undefined
const defaultData = [
  { name: "Jan", ventes: 4000, achats: 2400 },
  { name: "Fév", ventes: 3000, achats: 1800 },
  { name: "Mar", ventes: 5000, achats: 3000 },
  { name: "Avr", ventes: 2780, achats: 1890 },
  { name: "Mai", ventes: 1890, achats: 1200 },
  { name: "Jun", ventes: 2390, achats: 1700 },
  { name: "Jul", ventes: 3490, achats: 2100 }
]

export function Overview({ data }: OverviewProps) {
  // Use default data if data prop is undefined
  const chartData = data 
    ? data.labels.map((label, index) => ({
        name: label,
        ventes: data.data[index],
        achats: data.data[index] * 0.8 // Mock data for purchases
      }))
    : defaultData

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Activité des ventes</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-gray-600">Ventes</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-blue-400"></div>
            <span className="text-xs text-gray-600">Achats</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 15 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            label={{ value: 'Mois', position: 'insideBottom', offset: -10 }}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value} MAD`}
            label={{ value: 'Montant (MAD)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const ventes = payload[0]?.value as number || 0;
                const achats = payload[1]?.value as number || 0;
                return (
                  <div className="bg-white p-3 shadow-md border rounded-md">
                    <p className="font-medium">{label}</p>
                    <p className="text-emerald-600">Ventes: {ventes} MAD</p>
                    <p className="text-blue-500">Achats: {achats} MAD</p>
                    <p className="text-sm text-gray-600 mt-1">Marge: {(ventes - achats).toFixed(0)} MAD</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend wrapperStyle={{ display: 'none' }} />
          <Bar 
            dataKey="ventes" 
            fill="#4ade80" 
            radius={[4, 4, 0, 0]} 
            barSize={20}
            label={{ 
              position: 'top', 
              formatter: (value: number) => `${value}`, 
              fontSize: 10,
              fill: '#64748b'
            }}
          />
          <Bar 
            dataKey="achats" 
            fill="#60a5fa" 
            radius={[4, 4, 0, 0]} 
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
