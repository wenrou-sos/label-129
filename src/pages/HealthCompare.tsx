import { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { BarChart3, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import { formatDateCN } from '../utils/dateUtils';
import type { BloodTest, BiochemTest } from '../types';

type CompareTab = 'weight' | 'blood' | 'biochem';

export default function HealthCompare() {
  const { getLatestExamReport, getPreviousExamReport } = usePetStore();
  const [activeTab, setActiveTab] = useState<CompareTab>('weight');

  const latest = getLatestExamReport();
  const previous = getPreviousExamReport();

  if (!latest || !previous) {
    return (
      <div className="min-h-screen bg-surface-50 pb-24">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-surface-200 z-40">
          <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
            <h1 className="font-semibold text-surface-800 text-lg">健康指标对比</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <BarChart3 className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          <p className="text-surface-500 mb-2">体检数据不足</p>
          <p className="text-sm text-surface-400">至少需要2次体检记录才能进行对比</p>
        </div>
      </div>
    );
  }

  const weightData = [
    { name: formatDateCN(previous.date), 体重: previous.weight },
    { name: formatDateCN(latest.date), 体重: latest.weight },
  ];

  const bloodData = latest.bloodTests
    .filter((test) => previous.bloodTests.find((t) => t.name === test.name))
    .map((test) => {
      const prevTest = previous.bloodTests.find((t) => t.name === test.name)!;
      return {
        name: test.name.replace('计数', '').replace('比率', ''),
        上次: prevTest.value,
        本次: test.value,
        unit: test.unit,
        status: test.status,
      };
    });

  const biochemData = latest.biochemTests
    .filter((test) => previous.biochemTests.find((t) => t.name === test.name))
    .map((test) => {
      const prevTest = previous.biochemTests.find((t) => t.name === test.name)!;
      return {
        name: test.name.replace(/\(.*?\)/g, ''),
        上次: prevTest.value,
        本次: test.value,
        unit: test.unit,
        status: test.status,
      };
    });

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-accent-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-primary-500" />;
    return <Minus className="w-4 h-4 text-surface-400" />;
  };

  const getTrendText = (current: number, previous: number) => {
    const diff = (current - previous).toFixed(1);
    if (current > previous) return `+${diff}`;
    if (current < previous) return diff;
    return '0';
  };

  const tabs: { id: CompareTab; label: string }[] = [
    { id: 'weight', label: '体重趋势' },
    { id: 'blood', label: '血常规' },
    { id: 'biochem', label: '生化检查' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 pb-24">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-surface-200 z-40">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <h1 className="font-semibold text-surface-800 text-lg">健康指标对比</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-1 shadow-card">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex-1 h-9 text-sm font-medium rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'weight' && (
          <div className="bg-white rounded-2xl p-4 shadow-card animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-surface-800">体重变化趋势</h3>
              <span className="text-xs text-surface-500">
                {formatDateCN(previous.date)} → {formatDateCN(latest.date)}
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#737373' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#737373' }}
                    axisLine={false}
                    tickLine={false}
                    domain={['dataMin - 1', 'dataMax + 1']}
                    unit="kg"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                    }}
                    formatter={(value: number) => [`${value}kg`, '体重']}
                  />
                  <Line
                    type="monotone"
                    dataKey="体重"
                    stroke="#4ECDC4"
                    strokeWidth={3}
                    dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, fill: '#4ECDC4' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-primary-50 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-500 mb-1">体重变化</p>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(latest.weight, previous.weight)}
                    <span className="text-xl font-bold text-primary-600">
                      {getTrendText(latest.weight, previous.weight)} kg
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-surface-500 mb-1">当前体重</p>
                  <p className="text-xl font-bold text-surface-800">
                    {latest.weight} kg
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blood' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <h3 className="font-semibold text-surface-800 mb-4">血常规关键指标对比</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bloodData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#737373' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#737373' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value: number, _name: string, props: any) => [
                        `${value} ${props.payload.unit}`,
                        _name,
                      ]}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="rect"
                    />
                    <Bar dataKey="上次" fill="#d4d4d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="本次" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-card">
              <h3 className="font-semibold text-surface-800 mb-3">详细数据</h3>
              <div className="space-y-2">
                {bloodData.map((item, index) => {
                  const prevTest = previous.bloodTests.find((t) => t.name === latest.bloodTests[index].name) as BloodTest;
                  const currTest = latest.bloodTests[index];
                  return (
                    <div
                      key={item.name}
                      className={`p-3 rounded-xl ${
                        item.status !== 'normal' ? 'bg-accent-50' : 'bg-surface-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-surface-700">
                          {item.name}
                        </span>
                        {item.status !== 'normal' && (
                          <span className="flex items-center gap-1 text-xs text-accent-500">
                            <AlertTriangle className="w-3 h-3" />
                            {item.status === 'high' ? '偏高' : '偏低'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-surface-500">
                        <span>上次: {prevTest.value} {item.unit}</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(currTest.value, prevTest.value)}
                          <span>{getTrendText(currTest.value, prevTest.value)}</span>
                        </div>
                        <span className="font-medium text-primary-600">
                          本次: {currTest.value} {item.unit}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'biochem' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <h3 className="font-semibold text-surface-800 mb-4">生化检查关键指标对比</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={biochemData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#737373' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#737373' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                      }}
                      formatter={(value: number, _name: string, props: any) => [
                        `${value} ${props.payload.unit}`,
                        _name,
                      ]}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '12px' }}
                      iconType="rect"
                    />
                    <Bar dataKey="上次" fill="#d4d4d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="本次" fill="#FF6B6B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-card">
              <h3 className="font-semibold text-surface-800 mb-3">详细数据</h3>
              <div className="space-y-2">
                {biochemData.map((item, index) => {
                  const prevTest = previous.biochemTests.find((t) => t.name === latest.biochemTests[index].name) as BiochemTest;
                  const currTest = latest.biochemTests[index];
                  return (
                    <div
                      key={item.name}
                      className={`p-3 rounded-xl ${
                        item.status !== 'normal' ? 'bg-accent-50' : 'bg-surface-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-surface-700">
                          {item.name}
                        </span>
                        {item.status !== 'normal' && (
                          <span className="flex items-center gap-1 text-xs text-accent-500">
                            <AlertTriangle className="w-3 h-3" />
                            {item.status === 'high' ? '偏高' : '偏低'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-surface-500">
                        <span>上次: {prevTest.value} {item.unit}</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(currTest.value, prevTest.value)}
                          <span>{getTrendText(currTest.value, prevTest.value)}</span>
                        </div>
                        <span className="font-medium text-accent-500">
                          本次: {currTest.value} {item.unit}
                        </span>
                      </div>
                      <p className="text-xs text-surface-400 mt-1">
                        参考范围: {currTest.reference}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
