import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Camera,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { mockSystemMetrics, mockRiskAlerts, hourlyBatchData, mockDailyStats, mockRevenueMetrics } from '../../data/adminMockData';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Link } from 'react-router';

export default function AdminOverview() {
  const metrics = mockSystemMetrics;
  const revenueMetrics = mockRevenueMetrics;
  const recentAlerts = mockRiskAlerts.filter(a => a.status === 'active').slice(0, 5);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    return `${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Tổng quan hệ thống</h1>
          <p className="text-slate-400 mt-1">Dashboard quản trị MYLONGAI BatchGuard</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
            <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
            Hệ thống hoạt động
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300">
            {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Tổng mẻ bánh hôm nay</p>
                <h3 className="text-3xl font-bold text-white mt-2">{metrics.totalBatchesToday}</h3>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">+15%</span>
                  <span className="text-slate-500">vs hôm qua</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Tỷ lệ đạt chuẩn</p>
                <h3 className="text-3xl font-bold text-white mt-2">{metrics.successRate}%</h3>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-red-400">-2.3%</span>
                  <span className="text-slate-500">vs tuần trước</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Đang hoạt động</p>
                <h3 className="text-3xl font-bold text-white mt-2">{metrics.activeBatches}</h3>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-400">Trung bình {metrics.avgDryingTime} phút</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">Camera Online</p>
                <h3 className="text-3xl font-bold text-white mt-2">
                  {metrics.camerasOnline}/{metrics.totalCameras}
                </h3>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  {metrics.camerasOnline === metrics.totalCameras ? (
                    <span className="text-green-400">Tất cả hoạt động</span>
                  ) : (
                    <span className="text-yellow-400">1 camera offline</span>
                  )}
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Camera className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Hoạt động theo giờ (Hôm nay)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hourlyBatchData}>
                <defs>
                  <linearGradient id="adminOverviewActiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} key="stop1-active"/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} key="stop2-active"/>
                  </linearGradient>
                  <linearGradient id="adminOverviewCompletedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} key="stop1-completed"/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} key="stop2-completed"/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="hour" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#3b82f6" 
                  fill="url(#adminOverviewActiveGradient)" 
                  name="Đang phơi"
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#10b981" 
                  fill="url(#adminOverviewCompletedGradient)" 
                  name="Hoàn thành"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Success Rate */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Tỷ lệ thành công 7 ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockDailyStats.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#94a3b8"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f1f5f9' }}
                  formatter={(value: number) => `${value}%`}
                />
                <Bar dataKey="successRate" fill="#10b981" name="Tỷ lệ thành công %" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Summary Card */}
      <Card className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <CardTitle className="text-white">Tổng quan doanh thu</CardTitle>
                <p className="text-sm text-slate-400 mt-1">Hiệu quả kinh doanh hôm nay</p>
              </div>
            </div>
            <Link to="/admin/revenue">
              <button className="px-4 py-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-sm font-medium">
                Xem chi tiết →
              </button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-slate-900/50">
              <p className="text-sm text-slate-400 mb-1">Hôm nay</p>
              <p className="text-2xl font-bold text-cyan-400">{formatCurrency(revenueMetrics.today)}</p>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400">+{revenueMetrics.growth.today.toFixed(1)}%</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50">
              <p className="text-sm text-slate-400 mb-1">Tuần này</p>
              <p className="text-2xl font-bold text-blue-400">{formatCurrency(revenueMetrics.week)}</p>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400">+{revenueMetrics.growth.week.toFixed(1)}%</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50">
              <p className="text-sm text-slate-400 mb-1">Tháng này</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(revenueMetrics.month)}</p>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400">+{revenueMetrics.growth.month.toFixed(1)}%</span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50">
              <p className="text-sm text-slate-400 mb-1">Giá trị TB/Mẻ</p>
              <p className="text-2xl font-bold text-purple-400">{formatCurrency(revenueMetrics.avgPerBatch)}</p>
              <div className="flex items-center gap-1 mt-1 text-xs">
                <span className="text-purple-400">{revenueMetrics.conversionRate}% chuyển đổi</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Alerts */}
        <Card className="lg:col-span-2 bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Cảnh báo gần đây</CardTitle>
              <Badge variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20">
                {recentAlerts.length} cảnh báo
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${alert.severity === 'critical' ? 'bg-red-500/10' : 
                      alert.severity === 'high' ? 'bg-orange-500/10' : 
                      alert.severity === 'medium' ? 'bg-yellow-500/10' : 'bg-blue-500/10'}
                  `}>
                    <AlertTriangle className={`w-5 h-5
                      ${alert.severity === 'critical' ? 'text-red-400' : 
                        alert.severity === 'high' ? 'text-orange-400' : 
                        alert.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'}
                    `} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium">{alert.batchName}</h4>
                      <Badge 
                        variant="outline" 
                        className={`
                          ${alert.severity === 'critical' ? 'border-red-500/50 text-red-400' : 
                            alert.severity === 'high' ? 'border-orange-500/50 text-orange-400' : 
                            alert.severity === 'medium' ? 'border-yellow-500/50 text-yellow-400' : 'border-blue-500/50 text-blue-400'}
                        `}
                      >
                        {alert.severity === 'critical' ? 'Nghiêm trọng' : 
                         alert.severity === 'high' ? 'Cao' : 
                         alert.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">{alert.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>{alert.location}</span>
                      <span>•</span>
                      <span>{new Date(alert.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Thống kê nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="text-sm text-slate-300">Hoàn thành</span>
              </div>
              <span className="text-lg font-bold text-green-400">{metrics.completedBatches}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-sm text-slate-300">Thất bại</span>
              </div>
              <span className="text-lg font-bold text-red-400">{metrics.failedBatches}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-slate-300">Thời gian TB</span>
              </div>
              <span className="text-lg font-bold text-blue-400">{metrics.avgDryingTime}m</span>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="text-sm text-slate-400 mb-2">Hiệu suất hệ thống</div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all"
                  style={{ width: `${metrics.successRate}%` }}
                />
              </div>
              <div className="text-right text-xs text-slate-500 mt-1">{metrics.successRate}% đạt chuẩn</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}