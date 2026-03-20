import { Link } from 'react-router';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { AlertTriangle, Clock, Thermometer, Droplets, ArrowRight, TrendingUp } from 'lucide-react';
import { Batch } from '../data/mockData';

interface BatchCardProps {
  batch: Batch;
}

export function BatchCard({ batch }: BatchCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200';
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
      return `${hours}h ${mins}p`;
    }
    return `${mins}p`;
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-2 border-sky-200 hover:border-emerald-300 bg-white overflow-hidden">
      <CardContent className="p-0">
        {/* Colored Top Bar - gradient sky to leaf */}
        <div className={`h-1.5 ${
          batch.riskLevel === 'high' ? 'bg-gradient-to-r from-rose-500 to-rose-600' :
          batch.riskLevel === 'medium' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
          'bg-gradient-to-r from-sky-400 via-emerald-400 to-sky-500'
        }`} />
        
        <div className="p-5 md:p-6 space-y-4 md:space-y-5">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:text-sky-600 transition-colors">
                {batch.name}
              </h3>
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
                <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-600" />
                <span>{new Date(batch.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
            <Badge className={`${getRiskColor(batch.riskLevel)} border font-medium px-2.5 md:px-3 py-1 text-xs md:text-sm`}>
              {getRiskLabel(batch.riskLevel)}
            </Badge>
          </div>

          {/* Progress Section - gradient sky to leaf */}
          <div className="space-y-2.5 md:space-y-3 bg-gradient-to-br from-sky-50 via-white to-emerald-50 rounded-xl p-3.5 md:p-4 border-2 border-sky-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600" />
                <span className="text-xs md:text-sm font-medium text-gray-700">Độ khô</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">
                  {batch.dryingProgress}
                </span>
                <span className="text-base md:text-lg font-semibold text-gray-600">%</span>
              </div>
            </div>
            <div className="relative">
              <Progress value={batch.dryingProgress} className="h-2 md:h-2.5 bg-gray-200" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>

          {/* Time Remaining - alternating colors */}
          {batch.estimatedTimeRemaining > 0 && (
            <div className="flex items-center justify-between p-2.5 md:p-3 bg-gradient-to-r from-emerald-50 to-sky-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-sky-400 to-emerald-400 rounded-full flex items-center justify-center shadow-sm">
                  <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                </div>
                <span className="text-xs md:text-sm text-gray-700">Còn lại</span>
              </div>
              <span className="text-sm md:text-base font-semibold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">{formatTime(batch.estimatedTimeRemaining)}</span>
            </div>
          )}

          {/* Weather Info Grid - alternating sky and leaf */}
          <div className="grid grid-cols-2 gap-2.5 md:gap-3">
            <div className="flex items-center gap-2 md:gap-2.5 p-2.5 md:p-3 bg-gradient-to-br from-sky-50 to-sky-100/30 rounded-lg border border-sky-200">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-sky-100 rounded-lg flex items-center justify-center ring-2 ring-sky-200/50">
                <Thermometer className="w-4 h-4 md:w-4.5 md:h-4.5 text-sky-600" />
              </div>
              <div>
                <div className="text-[10px] md:text-xs text-gray-600 mb-0.5">Nhiệt độ</div>
                <div className="text-sm md:text-base font-semibold text-gray-900">{batch.temperature}°C</div>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-2.5 p-2.5 md:p-3 bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-lg border border-emerald-200">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-emerald-100 rounded-lg flex items-center justify-center ring-2 ring-emerald-200/50">
                <Droplets className="w-4 h-4 md:w-4.5 md:h-4.5 text-emerald-600" />
              </div>
              <div>
                <div className="text-[10px] md:text-xs text-gray-600 mb-0.5">Độ ẩm</div>
                <div className="text-sm md:text-base font-semibold text-gray-900">{batch.humidity}%</div>
              </div>
            </div>
          </div>

          {/* Risk Warning */}
          {batch.riskLevel !== 'low' && (
            <div className={`rounded-lg p-3 md:p-3.5 border ${
              batch.riskLevel === 'high' 
                ? 'bg-rose-50 border-rose-200' 
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-start gap-2 md:gap-2.5">
                <AlertTriangle className={`w-4 h-4 md:w-4.5 md:h-4.5 mt-0.5 flex-shrink-0 ${
                  batch.riskLevel === 'high' ? 'text-rose-600' : 'text-amber-600'
                }`} />
                <p className={`text-xs md:text-sm leading-relaxed ${
                  batch.riskLevel === 'high' ? 'text-rose-900' : 'text-amber-900'
                }`}>
                  {batch.weatherRisk}
                </p>
              </div>
            </div>
          )}

          {/* Action Button - gradient sky to leaf */}
          <Link to={`/dashboard/batch/${batch.id}`} className="block">
            <Button 
              className={`w-full h-10 md:h-11 text-sm md:text-base font-medium shadow-sm transition-all duration-200 ${
                batch.riskLevel === 'high'
                  ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-rose-200'
                  : 'bg-gradient-to-r from-sky-500 via-emerald-400 to-sky-600 hover:from-sky-600 hover:via-emerald-500 hover:to-sky-700 text-white shadow-sky-200'
              }`}
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="ml-2 w-3.5 h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}