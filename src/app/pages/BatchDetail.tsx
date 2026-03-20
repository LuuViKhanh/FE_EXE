import { useParams, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { mockBatches, mockHistoricalData, mockAlerts } from '../data/mockData';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Wind, 
  Clock,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function BatchDetail() {
  const { id } = useParams();
  const batch = mockBatches.find(b => b.id === id);

  if (!batch) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="border-gray-200">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy batch</p>
            <p className="text-sm text-gray-600 mb-6">Batch này có thể đã bị xóa hoặc không tồn tại</p>
            <Link to="/dashboard">
              <Button className="bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800">
                Quay lại tổng quan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low':
        return 'Rủi ro thấp';
      case 'medium':
        return 'Cần chú ý';
      case 'high':
        return 'Rủi ro cao';
      default:
        return 'Không xác định';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} giờ ${mins} phút`;
    }
    return `${mins} phút`;
  };

  // Recommendations based on risk level
  const getRecommendations = () => {
    if (batch.riskLevel === 'high') {
      return {
        icon: AlertTriangle,
        color: 'rose',
        title: 'Hành động khẩn cấp',
        actions: [
          'Thu bánh trong vòng 30 phút',
          'Hoặc che chắn ngay lập tức',
          'Giám sát liên tục'
        ]
      };
    } else if (batch.riskLevel === 'medium') {
      return {
        icon: Clock,
        color: 'amber',
        title: 'Theo dõi sát sao',
        actions: [
          'Chuẩn bị thu bánh trong 1-2 giờ tới',
          'Theo dõi thay đổi thời tiết',
          'Sẵn sàng che chắn nếu cần'
        ]
      };
    } else {
      return {
        icon: CheckCircle2,
        color: 'emerald',
        title: 'Tiếp tục phơi',
        actions: [
          'Có thể tiếp tục phơi an toàn',
          'Dự kiến hoàn thành sau ' + formatTime(batch.estimatedTimeRemaining),
          'Kiểm tra định kỳ mỗi 30 phút'
        ]
      };
    }
  };

  const recommendation = getRecommendations();

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 md:gap-4">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon" className="hover:bg-gray-100 rounded-lg h-9 w-9 md:h-10 md:w-10">
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{batch.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-1">
              <div className="flex items-center gap-1.5 text-xs md:text-sm text-gray-600">
                <Clock className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>Bắt đầu: {new Date(batch.startTime).toLocaleString('vi-VN')}</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full" />
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs md:text-sm font-medium text-emerald-600">Đang phơi</span>
              </div>
            </div>
          </div>
        </div>
        <Badge className={`${getRiskColor(batch.riskLevel)} border-2 text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 font-semibold shadow-sm self-start sm:self-auto`}>
          {getRiskLabel(batch.riskLevel)}
        </Badge>
      </div>

      {/* Main Progress Card */}
      <Card className="border-2 border-cyan-200 bg-gradient-to-br from-white to-cyan-50/30 shadow-lg overflow-hidden">
        <div className="h-1.5 md:h-2 bg-gradient-to-r from-cyan-500 via-cyan-600 to-amber-500" />
        <CardContent className="p-5 md:p-8">
          <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
            <div className="space-y-5 md:space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-cyan-600" />
                  <h3 className="text-base md:text-lg font-semibold text-gray-700">Độ khô hiện tại</h3>
                </div>
                <div className="flex items-baseline gap-2 md:gap-3 mb-4 md:mb-5">
                  <span className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-700 bg-clip-text text-transparent">
                    {batch.dryingProgress}
                  </span>
                  <div>
                    <span className="text-2xl md:text-3xl font-semibold text-gray-600">%</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Zap className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-600" />
                      <span className="text-[10px] md:text-xs text-emerald-600 font-medium">Dự đoán bởi AI</span>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={batch.dryingProgress} className="h-4 md:h-5 bg-gray-200 shadow-inner" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-full" />
                </div>
              </div>
              
              {batch.estimatedTimeRemaining > 0 && (
                <div className="flex items-center justify-between p-3 md:p-4 bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-xl border-2 border-cyan-200">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-9 h-9 md:w-10 md:h-10 bg-cyan-600 rounded-lg flex items-center justify-center shadow-md">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-700">Thời gian ước tính còn lại</span>
                  </div>
                  <span className="text-xl md:text-2xl font-bold text-cyan-700">{formatTime(batch.estimatedTimeRemaining)}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-2 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <div className="w-9 h-9 md:w-11 md:h-11 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
                      <Thermometer className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-700">Nhiệt độ</span>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-orange-600">{batch.temperature}°C</p>
                  <p className="text-[10px] md:text-xs text-orange-700 mt-1 md:mt-2">Điều kiện tốt</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    <div className="w-9 h-9 md:w-11 md:h-11 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                      <Droplets className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <span className="text-xs md:text-sm font-medium text-gray-700">Độ ẩm</span>
                  </div>
                  <p className="text-3xl md:text-4xl font-bold text-blue-600">{batch.humidity}%</p>
                  <p className="text-[10px] md:text-xs text-blue-700 mt-1 md:mt-2">Đang giảm</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 col-span-2 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-9 h-9 md:w-11 md:h-11 bg-gray-500 rounded-lg flex items-center justify-center shadow-md">
                        <Wind className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <span className="text-xs md:text-sm font-medium text-gray-700">Tốc độ gió</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl md:text-2xl font-bold text-gray-900">12 km/h</p>
                      <p className="text-[10px] md:text-xs text-gray-600 mt-1">Nhẹ, ổn định</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation Card */}
      <Card className={`border-2 border-${recommendation.color}-300 bg-gradient-to-br from-${recommendation.color}-50 to-${recommendation.color}-100/30 shadow-lg`}>
        <CardHeader className="border-b border-${recommendation.color}-200">
          <CardTitle className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-${recommendation.color}-500 rounded-lg flex items-center justify-center`}>
              <recommendation.icon className="w-6 h-6 text-white" />
            </div>
            <span className={`text-${recommendation.color}-900`}>{recommendation.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ul className="space-y-3">
            {recommendation.actions.map((action, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 text-${recommendation.color}-600 flex-shrink-0 mt-0.5`} />
                <span className={`text-${recommendation.color}-900 leading-relaxed`}>{action}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Drying Progress Chart */}
        <Card className="border-gray-200 shadow-md">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-lg">Tiến độ khô theo thời gian</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockHistoricalData} key="progress-chart">
                <defs>
                  <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280" 
                  style={{ fontSize: '12px' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#6b7280" 
                  style={{ fontSize: '12px' }}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ stroke: '#0891b2', strokeWidth: 1 }}
                />
                <Area 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#0891b2" 
                  strokeWidth={3}
                  fill="url(#colorProgress)"
                  name="Độ khô (%)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Environmental Conditions Chart */}
        <Card className="border-gray-200 shadow-md">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-lg">Điều kiện môi trường</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockHistoricalData} key="environment-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280" 
                  style={{ fontSize: '12px' }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#6b7280" 
                  style={{ fontSize: '12px' }}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  cursor={{ stroke: '#9ca3af', strokeWidth: 1 }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line 
                  key="temperature-line-batch"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 4 }}
                  name="Nhiệt độ (°C)"
                  isAnimationActive={true}
                />
                <Line 
                  key="humidity-line-batch"
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Độ ẩm (%)"
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Warnings */}
      {mockAlerts.length > 0 && (
        <Card className="border-gray-200 shadow-md">
          <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Cảnh báo & Thông báo
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                  alert.type === 'danger'
                    ? 'bg-gradient-to-br from-rose-50 to-rose-100/30 border-rose-200'
                    : alert.type === 'warning'
                    ? 'bg-gradient-to-br from-amber-50 to-amber-100/30 border-amber-200'
                    : 'bg-gradient-to-br from-blue-50 to-blue-100/30 border-blue-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    alert.type === 'danger' ? 'bg-rose-500' :
                    alert.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}>
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <p className={`font-semibold ${
                        alert.type === 'danger' ? 'text-rose-900' :
                        alert.type === 'warning' ? 'text-amber-900' : 'text-blue-900'
                      }`}>{alert.message}</p>
                      <span className="text-sm text-gray-600 font-medium">{alert.time}</span>
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      alert.type === 'danger' ? 'text-rose-800' :
                      alert.type === 'warning' ? 'text-amber-800' : 'text-blue-800'
                    }`}>→ {alert.actionRequired}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Weather Risk Timeline */}
      <Card className="border-gray-200 shadow-md">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <CardTitle className="text-lg">Dự báo rủi ro 6 giờ tới</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[
              { time: '14:00 - 15:00', risk: 'low', desc: 'Điều kiện ổn định' },
              { time: '15:00 - 16:00', risk: 'low', desc: 'Thời tiết tốt' },
              { time: '16:00 - 17:00', risk: 'medium', desc: 'Độ ẩm bắt đầu tăng' },
              { time: '17:00 - 18:00', risk: 'high', desc: 'Nguy cơ mưa 70%' },
              { time: '18:00 - 19:00', risk: 'high', desc: 'Dự báo mưa rào' },
              { time: '19:00 - 20:00', risk: 'medium', desc: 'Mưa giảm dần' },
            ].map((period, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <span className="text-sm font-semibold text-gray-700 w-32">{period.time}</span>
                <div className="flex-1 h-12 rounded-xl flex items-center px-5 border-2 transition-all group-hover:shadow-md"
                  style={{
                    backgroundColor: period.risk === 'high' ? '#fff1f2' : period.risk === 'medium' ? '#fffbeb' : '#f0fdf4',
                    borderColor: period.risk === 'high' ? '#fecdd3' : period.risk === 'medium' ? '#fef3c7' : '#dcfce7',
                  }}
                >
                  <div className={`w-1.5 h-8 rounded-full mr-4 ${
                    period.risk === 'high' ? 'bg-rose-500' : 
                    period.risk === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    period.risk === 'high' ? 'text-rose-900' :
                    period.risk === 'medium' ? 'text-amber-900' : 'text-emerald-900'
                  }`}>{period.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}