"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "1月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "2月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "3月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "4月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "5月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "6月",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
]

export function Overview() {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar dataKey="total" fill="#17B890" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
