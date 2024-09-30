import React from "react";
import PropTypes from 'prop-types';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Chart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="color1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c6ff" stopOpacity={1} />
            <stop offset="100%" stopColor="#0072ff" stopOpacity={1} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="name"
          tickLine={false}
          tick={{ fill: "#333", fontSize: 12, fontWeight: 600 }}
        />
        <YAxis
          tickLine={false}
          tick={{ fill: "#333", fontSize: 12, fontWeight: 600 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            border: '1px solid #ddd',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
          labelStyle={{ color: '#0072ff', fontWeight: 'bold' }}
          itemStyle={{ color: '#333' }}
        />
        <Legend
          wrapperStyle={{ paddingTop: 20, fontSize: 12, fontWeight: 600 }}
          iconType="circle"
        />
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <Bar
          dataKey="total"
          fill="url(#color1)"
          radius={[10, 10, 0, 0]}
          animationDuration={500}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
