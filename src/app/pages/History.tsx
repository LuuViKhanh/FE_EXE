import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useSystem } from '../contexts/SystemContext';
import { 
  CheckCircle2, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  Camera, 
  Activity, 
  Thermometer, 
  Droplets,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

export default function History() {
  const { batchHistory } = useSystem();
  
  // Calculate success metrics
  const successCount = batchHistory.filter(b => b.outcome === 'success').length;
  const earlyCollectionCount = batchHistory.filter(b => b.outcome === 'early_collection').length;
  const warningCompletedCount = batchHistory.filter(b => b.outcome === 'warning_completed').length;
  
  const successRate = batchHistory.length > 0 
    ? ((successCount / batchHistory.length) * 100).toFixed(1)
    : '0.0';
  
  // Calculate average completion time
  const avgCompletionTime = batchHistory.length > 0
    ? Math.round(batchHistory.reduce((sum, b) => sum + (b.completionDuration || 0), 0) / batchHistory.length)
    : 0;
  
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  // Prepare chart data for recent batches
  const chartData = batchHistory.slice(0, 8).reverse().map((batch, index) => ({
    id: batch.id,
    name: `#${8 - index}`,
    duration: Math.round((batch.completionDuration || 0) / 60 * 10) / 10, // in hours
    success: batch.outcome === 'success' ? 100 : batch.outcome === 'warning_completed' ? 75 : 50,
  }));
  
  // Daily success rate for last 7 days
  const dailySuccessData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayBatches = batchHistory.filter(b => {
      const batchDate = new Date(b.startTime);
      return batchDate.toDateString() === date.toDateString();
    });
    
    const daySuccess = dayBatches.filter(b => b.outcome === 'success').length;
    const rate = dayBatches.length > 0 ? Math.round((daySuccess / dayBatches.length) * 100) : 0;
    
    return {
      day: date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'numeric' }),
      rate,
      count: dayBatches.length,
    };
  });

  const getOutcomeInfo = (outcome?: string, risk?: string) => {
    switch (outcome) {
      case 'success':
        return {
          label: 'Thành công',
          color: 'emerald',
          icon: CheckCircle,
          bgClass: 'bg-emerald-500/10',
          textClass: 'text-emerald-400',
          borderClass: 'border-emerald-500/30',
        };
      case 'early_collection':
        return {
          label: 'Thu sớm',
          color: 'amber',
          icon: Clock,
          bgClass: 'bg-amber-500/10',
          textClass: 'text-amber-400',
          borderClass: 'border-amber-500/30',
        };
      case 'warning_completed':
        return {
          label: 'Hoàn thành có cảnh báo',
          color: 'orange',
          icon: AlertTriangle,
          bgClass: 'bg-orange-500/10',
          textClass: 'text-orange-400',
          borderClass: 'border-orange-500/30',
        };
      default:
        return {
          label: 'Hoàn thành',
          color: 'slate',
          icon: CheckCircle2,
          bgClass: 'bg-slate-800',
          textClass: 'text-slate-300',
          borderClass: 'border-slate-700',
        };
    }
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 font-medium shadow-[0_0_8px_rgba(239,68,68,0.2)]">Rủi ro cao</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 font-medium shadow-[0_0_8px_rgba(245,158,11,0.2)]">Rủi ro trung bình</Badge>;
      case 'low':
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-medium shadow-[0_0_8px_rgba(16,185,129,0.2)]">Rủi ro thấp</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Lịch sử mẻ bánh</h1>
          <p className="text-sm md:text-base text-slate-400">Các mẻ bánh đã được phát hiện và theo dõi tự động</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.15)]">
          <Camera className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-semibold text-purple-400">Tự động phát hiện</span>
        </div>
      </div>

      {/* Stats Grid - Soft UI / Metallic Style */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Tổng số batch */}
        <Card className="border-none rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.4)] bg-gradient-to-br from-[#D8DAE0] via-[#F1F3F5] to-[#B3B6BD] transition-transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#0284C7] rounded-full flex items-center justify-center shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-white/50 text-[#0369A1] border-none shadow-sm hover:bg-white/80">Tổng số</Badge>
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-700 mb-1">Tổng mẻ bánh phát hiện</p>
              <p className="text-4xl font-black text-[#0369A1]">{batchHistory.length}</p>
            </div>
          </CardContent>
        </Card>

        {/* Tỷ lệ thành công */}
        <Card className="border-none rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.4)] bg-gradient-to-br from-[#E2F0CB] to-[#B5D596] transition-transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#16A34A] rounded-full flex items-center justify-center shadow-md">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-[#15803D] bg-white/50 px-2 py-1 rounded-full shadow-sm">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-xs font-bold">Xuất sắc</span>
              </div>
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-700 mb-1">Tỷ lệ thành công</p>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black text-[#15803D]">{successRate}%</p>
                <span className="text-sm font-semibold text-slate-600">({successCount}/{batchHistory.length})</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thời gian TB */}
        <Card className="border-none rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.4)] bg-gradient-to-br from-[#D0E4FF] to-[#A1C6F8] transition-transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center shadow-md">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-white/50 text-[#1D4ED8] border-none shadow-sm hover:bg-white/80">Trung bình</Badge>
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-700 mb-1">Thời gian hoàn thành TB</p>
              <p className="text-4xl font-black text-[#1D4ED8]">{formatDuration(avgCompletionTime)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Độ chính xác AI */}
        <Card className="border-none rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.4)] bg-gradient-to-br from-[#E9D5FF] to-[#D8B4FE] transition-transform hover:scale-105">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#9333EA] rounded-full flex items-center justify-center shadow-md">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-white/50 text-[#6B21A8] border-none shadow-sm hover:bg-white/80">AI</Badge>
            </div>
            <div>
              <p className="text-[15px] font-bold text-slate-700 mb-1">Độ chính xác AI</p>
              <p className="text-4xl font-black text-[#6B21A8]">95%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Completion Duration Chart */}
        <Card className="border-slate-800 bg-[#151E2F] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
            <CardTitle className="text-base md:text-lg text-white">Thời gian hoàn thành 8 batch gần nhất</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="durationGradientHistory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94A3B8" 
                  style={{ fontSize: '12px', fontWeight: '500' }}
                  interval={0}
                  tick={{ fill: '#94A3B8' }}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  style={{ fontSize: '12px' }}
                  allowDecimals={true}
                  label={{ value: 'Giờ', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#94A3B8' } }}
                  tick={{ fill: '#94A3B8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B1121', 
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    color: '#F8FAFC'
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  formatter={(value: number) => [`${value} giờ`, 'Thời gian']}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Bar 
                  dataKey="duration" 
                  name="Thời gian (giờ)" 
                  radius={[8, 8, 0, 0]} 
                  fill="url(#durationGradientHistory)"
                  isAnimationActive={true}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Success Rate Chart */}
        <Card className="border-slate-800 bg-[#151E2F] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
            <CardTitle className="text-base md:text-lg text-white">Tỷ lệ thành công 7 ngày gần nhất</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={dailySuccessData} key={`success-chart-${batchHistory.length}`}>
                <defs>
                  <linearGradient id="successAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="day" 
                  stroke="#94A3B8" 
                  style={{ fontSize: '11px', fontWeight: '500' }}
                  interval={0}
                  tick={{ fill: '#94A3B8' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="#94A3B8" 
                  style={{ fontSize: '12px' }}
                  label={{ value: '%', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#94A3B8' } }}
                  tick={{ fill: '#94A3B8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B1121', 
                    border: '1px solid #1E293B',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    color: '#F8FAFC'
                  }}
                  cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                  formatter={(value: number, name: string, props: any) => [
                    `${value}% (${props.payload.count} batch)`, 
                    'Tỷ lệ thành công'
                  ]}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#successAreaGradient)"
                  name="Tỷ lệ thành công (%)"
                  isAnimationActive={true}
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#0B1121', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Outcome Summary - Dark Mode Neon */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:bg-emerald-500/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-400 font-medium mb-1">Thành công hoàn toàn</p>
                <p className="text-3xl font-bold text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">{successCount}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:bg-amber-500/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-400 font-medium mb-1">Thu sớm</p>
                <p className="text-3xl font-bold text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">{earlyCollectionCount}</p>
              </div>
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                <Clock className="w-7 h-7 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-orange-500/30 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:bg-orange-500/20 transition-colors">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-400 font-medium mb-1">Hoàn thành có cảnh báo</p>
                <p className="text-3xl font-bold text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">{warningCompletedCount}</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center border border-orange-500/30">
                <AlertTriangle className="w-7 h-7 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch List */}
      <Card className="border-slate-800 bg-[#151E2F] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
          <CardTitle className="text-base md:text-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-white">
            <span>Chi tiết các mẻ bánh đã hoàn thành</span>
            <Badge className="bg-slate-800 text-slate-300 border-slate-700 self-start sm:self-auto">{batchHistory.length} batch</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          {batchHistory.length > 0 ? (
            <div className="space-y-4">
              {batchHistory.map((batch) => {
                const outcomeInfo = getOutcomeInfo(batch.outcome, batch.risk);
                const OutcomeIcon = outcomeInfo.icon;
                
                return (
                  <div
                    key={batch.id}
                    className={`border ${outcomeInfo.borderClass} rounded-xl p-4 md:p-5 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all bg-[#0B1121] shadow-inner`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${outcomeInfo.bgClass} border ${outcomeInfo.borderClass}`}>
                            <OutcomeIcon className={`w-6 h-6 ${outcomeInfo.textClass}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                              <h3 className="text-base md:text-lg font-semibold text-white">
                                Batch #{batch.id.split('-')[1].slice(0, 8)}
                              </h3>
                              <Badge className={`${outcomeInfo.bgClass} ${outcomeInfo.textClass} ${outcomeInfo.borderClass} font-medium self-start`}>
                                {outcomeInfo.label}
                              </Badge>
                              {getRiskBadge(batch.risk)}
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 self-start">
                                <Camera className="w-3 h-3 mr-1" />
                                AI Detected
                              </Badge>
                            </div>
                            
                            {batch.notes && (
                              <div className="flex items-start gap-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-3">
                                <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-blue-300">{batch.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pl-0 md:pl-[52px]">
                          <div className="p-2.5 md:p-3 bg-[#151E2F] rounded-lg border border-slate-800">
                            <span className="text-[10px] md:text-xs text-slate-500 block mb-1">Vị trí</span>
                            <p className="font-semibold text-slate-200 text-xs md:text-sm">
                              {batch.location}
                            </p>
                          </div>
                          
                          <div className="p-2.5 md:p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                            <span className="text-[10px] md:text-xs text-blue-400 block mb-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Thời gian
                            </span>
                            <p className="font-bold text-blue-400 text-xs md:text-sm">
                              {formatDuration(batch.completionDuration || 0)}
                            </p>
                          </div>
                          
                          <div className="p-2.5 md:p-3 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
                            <span className="text-[10px] md:text-xs text-cyan-500 block mb-1">Độ khô đạt</span>
                            <p className="font-bold text-cyan-400 text-xs md:text-sm drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">{Math.round(batch.dryness)}%</p>
                          </div>
                          
                          <div className="p-2.5 md:p-3 bg-orange-500/5 rounded-lg border border-orange-500/20">
                            <div className="flex items-center gap-1 mb-1">
                              <Thermometer className="w-3 h-3 text-orange-500" />
                              <span className="text-[10px] md:text-xs text-orange-400">Nhiệt độ TB</span>
                            </div>
                            <p className="font-semibold text-orange-300 text-xs md:text-sm">{batch.temperature.toFixed(1)}°C</p>
                          </div>
                          
                          <div className="p-2.5 md:p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                            <div className="flex items-center gap-1 mb-1">
                              <Droplets className="w-3 h-3 text-blue-500" />
                              <span className="text-[10px] md:text-xs text-blue-400">Độ ẩm TB</span>
                            </div>
                            <p className="font-semibold text-blue-300 text-xs md:text-sm">{Math.round(batch.humidity)}%</p>
                          </div>
                        </div>

                        <div className="mt-3 pl-0 md:pl-[52px] p-2.5 md:p-3 bg-[#151E2F] rounded-lg border border-slate-800 flex items-center gap-2">
                          <span className="text-[10px] md:text-xs text-slate-500 font-medium">Timeline: </span>
                          <span className="text-xs md:text-sm text-slate-300 font-mono">
                            {new Date(batch.startTime).toLocaleString('vi-VN', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric',
                              hour: '2-digit', 
                              minute: '2-digit'
                            })} 
                            <span className="text-slate-500 mx-2">→</span> 
                            {new Date(batch.estimatedCompletion).toLocaleString('vi-VN', { 
                              hour: '2-digit', 
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#0B1121] border border-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-lg font-medium text-slate-300 mb-2">Chưa có mẻ bánh nào hoàn thành</p>
              <p className="text-sm text-slate-500">
                Camera AI sẽ tự động phát hiện và theo dõi mẻ bánh. Các mẻ bánh hoàn thành sẽ xuất hiện ở đây.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border border-cyan-500/30 bg-[#151E2F] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <CardHeader className="border-b border-slate-800 bg-[#0B1121]/50">
          <CardTitle className="flex items-center gap-3 text-base md:text-lg text-white">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-cyan-400">Phân tích và thông tin từ hệ thống AI quan sát</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-3 md:space-y-4">
          <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-[#0B1121] rounded-xl border border-cyan-500/20 shadow-inner">
            <Camera className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300 leading-relaxed text-xs md:text-sm">
              <strong className="text-cyan-400 font-semibold mr-1">Phát hiện tự động:</strong> Hệ thống quét mỗi 15 giây, AI Vision nhận diện và tạo batch tự động khi phát hiện bánh tráng
            </p>
          </div>
          <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-[#0B1121] rounded-xl border border-cyan-500/20 shadow-inner">
            <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300 leading-relaxed text-xs md:text-sm">
              <strong className="text-cyan-400 font-semibold mr-1">Tỷ lệ thành công {successRate}%:</strong> {successCount} batch hoàn thành xuất sắc, {earlyCollectionCount} batch thu sớm do điều kiện thời tiết
            </p>
          </div>
          <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-[#0B1121] rounded-xl border border-cyan-500/20 shadow-inner">
            <Activity className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300 leading-relaxed text-xs md:text-sm">
              <strong className="text-cyan-400 font-semibold mr-1">Giám sát theo thời gian thực:</strong> Nhiệt độ, độ ẩm, và độ khô được cập nhật mỗi 3 giây với độ chính xác 95%
            </p>
          </div>
          <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-[#0B1121] rounded-xl border border-cyan-500/20 shadow-inner">
            <Zap className="w-4 h-4 md:w-5 md:h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-300 leading-relaxed text-xs md:text-sm">
              <strong className="text-cyan-400 font-semibold mr-1">Thời gian trung bình {formatDuration(avgCompletionTime)}:</strong> Hệ thống dự đoán chính xác thời gian hoàn thành dựa trên điều kiện môi trường
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}