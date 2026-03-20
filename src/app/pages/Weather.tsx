import { useWeather } from '../hooks/useWeather';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { VoiceNotification } from '../components/VoiceNotification';
import { 
  Cloud, 
  CloudRain, 
  Droplets, 
  Thermometer, 
  Wind,
  Sun,
  CloudDrizzle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export default function Weather() {
  const { currentWeather, forecastData, loading, error } = useWeather();

  const getWeatherIcon = (icon: string, size: string = 'w-8 h-8') => {
    switch (icon) {
      case 'cloudrain':
        return <CloudRain className={`${size} text-blue-400`} />;
      case 'cloud':
        return <Cloud className={`${size} text-slate-400`} />;
      case 'drizzle':
        return <CloudDrizzle className={`${size} text-cyan-400`} />;
      default:
        return <Sun className={`${size} text-yellow-400`} />;
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous + 1) return <TrendingUp className="w-4 h-4 text-red-400" />;
    if (current < previous - 1) return <TrendingDown className="w-4 h-4 text-blue-400" />;
    return <Minus className="w-4 h-4 text-slate-500" />;
  };

  const highRiskHours = forecastData.filter(f => f.risk === 'high');

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-slate-400">
      <Cloud className="w-6 h-6 animate-pulse mr-2" /> Đang tải dữ liệu thời tiết...
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64 text-red-400">
      <AlertTriangle className="w-6 h-6 mr-2" /> {error}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Thời tiết khu vực</h1>
          <p className="text-sm md:text-base text-slate-400">Theo dõi và dự báo điều kiện thời tiết</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <VoiceNotification weatherData={currentWeather} />
          <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">Weather AI</span>
          </div>
        </div>
      </div>

      {/* Current Weather Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nhiệt độ */}
        <Card className="border border-[#3A2E2A] bg-gradient-to-br from-[#2A2421] to-[#1F1A18] shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                  <Thermometer className="w-6 h-6 text-orange-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Nhiệt độ</span>
              </div>
              {forecastData.length > 1 && getTrendIcon(currentWeather.temperature, forecastData[0].temperature)}
            </div>
            <div className="text-4xl font-bold text-orange-500 mb-1 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
              {currentWeather.temperature.toFixed(1)}°C
            </div>
            <p className="text-xs text-orange-400/80">Điều kiện: {currentWeather.temperature > 30 ? 'Nóng' : 'Ấm'}</p>
          </CardContent>
        </Card>

        {/* Độ ẩm */}
        <Card className="border border-[#2A344D] bg-gradient-to-br from-[#1E2335] to-[#171A28] shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                  <Droplets className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Độ ẩm</span>
              </div>
              {forecastData.length > 1 && getTrendIcon(currentWeather.humidity, forecastData[0].humidity)}
            </div>
            <div className="text-4xl font-bold text-blue-500 mb-1 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
              {Math.round(currentWeather.humidity)}%
            </div>
            <p className="text-xs text-blue-400/80">
              {currentWeather.humidity > 70 ? 'Rất cao' : currentWeather.humidity > 60 ? 'Cao' : 'Bình thường'}
            </p>
          </CardContent>
        </Card>

        {/* Khả năng mưa */}
        <Card className="border border-[#25424D] bg-gradient-to-br from-[#1A2C35] to-[#14222A] shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                  <CloudRain className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Khả năng mưa</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-cyan-500 mb-1 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
              {Math.round(currentWeather.rainChance)}%
            </div>
            <p className="text-xs text-cyan-400/80">
              {currentWeather.rainChance > 60 ? 'Rất cao' : currentWeather.rainChance > 30 ? 'Trung bình' : 'Thấp'}
            </p>
          </CardContent>
        </Card>

        {/* Tốc độ gió */}
        <Card className="border border-[#24453F] bg-gradient-to-br from-[#192E2B] to-[#132421] shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center border border-teal-500/30">
                  <Wind className="w-6 h-6 text-teal-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">Tốc độ gió</span>
              </div>
            </div>
            <div className="text-4xl font-bold text-teal-500 mb-1 drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]">
              {currentWeather.windSpeed.toFixed(1)} <span className="text-2xl text-teal-500/70">km/h</span>
            </div>
            <p className="text-xs text-teal-400/80">
              {currentWeather.windSpeed > 15 ? 'Mạnh' : currentWeather.windSpeed > 10 ? 'Vừa' : 'Nhẹ'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Condition Banner (Silver Metallic Gradient) */}
      <Card className="border-none shadow-[0_8px_30px_rgba(0,0,0,0.5)] bg-gradient-to-r from-[#D8DAE0] via-[#F1F3F5] to-[#B3B6BD]">
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                {getWeatherIcon(currentWeather.icon, 'w-10 h-10 text-white')}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1 drop-shadow-sm">{currentWeather.condition}</h3>
                <p className="text-sm font-medium text-slate-700">
                  Cập nhật: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <Badge className="bg-white/90 hover:bg-white text-slate-800 border-none shadow-md text-base px-4 py-2 font-semibold">
              Hiện tại
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Temperature & Humidity Forecast */}
        <Card className="border-slate-800 bg-[#151E2F] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
            <CardTitle className="text-base md:text-lg text-white">Dự báo nhiệt độ & độ ẩm (12 giờ tới)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={forecastData}>
                <defs>
                  <linearGradient id="tempGradientWeatherPage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="humidityGradientWeatherPage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  stroke="#94A3B8" 
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#94A3B8' }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#f97316" 
                  style={{ fontSize: '12px' }}
                  label={{ value: '°C', angle: -90, position: 'insideLeft', style: { fill: '#f97316' } }}
                  tick={{ fill: '#f97316' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#3b82f6" 
                  style={{ fontSize: '12px' }}
                  label={{ value: '%', angle: 90, position: 'insideRight', style: { fill: '#3b82f6' } }}
                  tick={{ fill: '#3b82f6' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B1121', 
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    color: '#F8FAFC'
                  }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Legend wrapperStyle={{ color: '#94A3B8' }}/>
                <Line 
                  key="temperature-line"
                  yAxisId="left"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  dot={{ fill: '#151E2F', stroke: '#f97316', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#f97316' }}
                  name="Nhiệt độ (°C)"
                  fill="url(#tempGradientWeatherPage)"
                />
                <Line 
                  key="humidity-line"
                  yAxisId="right"
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#151E2F', stroke: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#3b82f6' }}
                  name="Độ ẩm (%)"
                  fill="url(#humidityGradientWeatherPage)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Rain Chance Forecast */}
        <Card className="border-slate-800 bg-[#151E2F] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
            <CardTitle className="text-base md:text-lg text-white">Dự báo khả năng mưa (12 giờ tới)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="rainGradientWeatherPage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="time" 
                  stroke="#94A3B8" 
                  style={{ fontSize: '12px' }}
                  tick={{ fill: '#94A3B8' }}
                />
                <YAxis 
                  domain={[0, 100]}
                  stroke="#06b6d4" 
                  style={{ fontSize: '12px' }}
                  label={{ value: '%', angle: -90, position: 'insideLeft', style: { fill: '#06b6d4' } }}
                  tick={{ fill: '#06b6d4' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B1121', 
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    color: '#F8FAFC'
                  }}
                  itemStyle={{ color: '#06b6d4' }}
                  formatter={(value: number) => [`${value}%`, 'Khả năng mưa']}
                />
                <Area 
                  type="monotone" 
                  dataKey="rainChance" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  fill="url(#rainGradientWeatherPage)"
                  name="Khả năng mưa (%)"
                  activeDot={{ r: 6, fill: '#06b6d4' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Hours Alert */}
      {highRiskHours.length > 0 && (
        <Card className="border border-red-500/30 bg-[#151E2F] shadow-[0_0_20px_rgba(239,68,68,0.15)]">
          <CardHeader className="border-b border-slate-800 bg-[#0B1121]/50">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg text-red-400">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Cảnh báo khung giờ rủi ro cao
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-3">
              {highRiskHours.map((hour) => (
                <div
                  key={hour.id}
                  className="flex items-center justify-between p-4 bg-[#0B1121] rounded-xl border border-red-500/20 shadow-inner"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/30">
                      <CloudRain className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">{hour.time}</p>
                      <p className="text-sm text-red-400/80">Khả năng mưa cao</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">{hour.rainChance}%</p>
                    <p className="text-xs text-red-400/80">Độ ẩm: {hour.humidity}%</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-300 mb-1">Khuyến nghị:</p>
                  <p className="text-sm text-red-200/80 leading-relaxed">
                    Chuẩn bị thu bánh trước khung giờ rủi ro cao. Theo dõi sát tình hình thời tiết và cập nhật dự báo liên tục.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hourly Forecast Table */}
      <Card className="border-slate-800 bg-[#151E2F] shadow-md overflow-hidden">
        <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
          <CardTitle className="text-base md:text-lg text-white">Chi tiết dự báo theo giờ</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700 bg-[#0B1121]/50">
                  <th className="text-left p-4 text-sm font-semibold text-slate-400">Giờ</th>
                  <th className="text-center p-4 text-sm font-semibold text-slate-400">Nhiệt độ</th>
                  <th className="text-center p-4 text-sm font-semibold text-slate-400">Độ ẩm</th>
                  <th className="text-center p-4 text-sm font-semibold text-slate-400">Mưa</th>
                  <th className="text-center p-4 text-sm font-semibold text-slate-400">Gió</th>
                  <th className="text-center p-4 text-sm font-semibold text-slate-400">Rủi ro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {forecastData.map((hour) => (
                  <tr 
                    key={hour.id} 
                    className={`transition-colors hover:bg-slate-800/50 ${
                      hour.risk === 'high' ? 'bg-red-500/5' : 
                      hour.risk === 'medium' ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <td className="p-4">
                      <span className="font-mono font-semibold text-slate-200">{hour.time}</span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <span className="font-semibold text-orange-400">{hour.temperature}°C</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-blue-400">{hour.humidity}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <CloudRain className="w-4 h-4 text-cyan-500" />
                        <span className="font-semibold text-cyan-400">{hour.rainChance}%</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Wind className="w-4 h-4 text-teal-500" />
                        <span className="font-semibold text-teal-400">{hour.windSpeed} km/h</span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <Badge className={
                        hour.risk === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                        hour.risk === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }>
                        {hour.risk === 'high' ? 'Cao' : hour.risk === 'medium' ? 'TB' : 'Thấp'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}