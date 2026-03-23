import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  AlertTriangle, 
  Cloud, 
  Droplets, 
  Thermometer,
  CheckCircle2,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { mockRiskAlerts, allAdminBatches } from '../../data/adminMockData';
import { Link } from 'react-router';

export default function RiskManagement() {
  const [activeTab, setActiveTab] = useState('active');

  const activeAlerts = mockRiskAlerts.filter(a => a.status === 'active');
  const resolvedAlerts = mockRiskAlerts.filter(a => a.status === 'resolved');
  const highRiskBatches = allAdminBatches.filter(b => b.riskLevel === 'high' && b.status === 'active');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <Cloud className="w-5 h-5" />;
      case 'humidity':
        return <Droplets className="w-5 h-5" />;
      case 'temperature':
        return <Thermometer className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Cảnh báo & Quản lý Rủi ro</h1>
          <p className="text-slate-400 mt-1">Theo dõi và quản lý các cảnh báo, rủi ro trong hệ thống</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Cảnh báo đang hoạt động</p>
                <p className="text-3xl font-bold text-red-400 mt-2">{activeAlerts.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Batch rủi ro cao</p>
                <p className="text-3xl font-bold text-orange-400 mt-2">{highRiskBatches.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Đã giải quyết</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{resolvedAlerts.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Tỷ lệ giải quyết</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">
                  {Math.round((resolvedAlerts.length / mockRiskAlerts.length) * 100)}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Tabs */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Danh sách cảnh báo</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-slate-800 border border-slate-700">
              <TabsTrigger value="active" className="data-[state=active]:bg-blue-600">
                Đang hoạt động ({activeAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="resolved" className="data-[state=active]:bg-blue-600">
                Đã giải quyết ({resolvedAlerts.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6 space-y-4">
              {activeAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <p className="text-slate-400">Không có cảnh báo nào đang hoạt động</p>
                </div>
              ) : (
                activeAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                        {getTypeIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{alert.batchName}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity === 'critical' ? 'Nghiêm trọng' :
                             alert.severity === 'high' ? 'Cao' :
                             alert.severity === 'medium' ? 'Trung bình' : 'Thấp'}
                          </Badge>
                          <Badge variant="outline" className="border-slate-600 text-slate-300">
                            {alert.type === 'weather' ? 'Thời tiết' :
                             alert.type === 'humidity' ? 'Độ ẩm' :
                             alert.type === 'temperature' ? 'Nhiệt độ' : 'Hệ thống'}
                          </Badge>
                        </div>
                        <p className="text-slate-300 mb-3">{alert.message}</p>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                          <span>📍 {alert.location}</span>
                          <span>🕐 {new Date(alert.timestamp).toLocaleString('vi-VN')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/dashboard/batch/${alert.batchId}`}>
                          <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                            Xem chi tiết
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20">
                          Đánh dấu đã xử lý
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="resolved" className="mt-6 space-y-4">
              {resolvedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-6 rounded-lg bg-slate-800/30 border border-slate-700/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-slate-700/50">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-slate-400">{alert.batchName}</h3>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                          Đã giải quyết
                        </Badge>
                      </div>
                      <p className="text-slate-400 mb-3">{alert.message}</p>
                      <div className="flex items-center gap-6 text-sm text-slate-500">
                        <span>📍 {alert.location}</span>
                        <span>🕐 {new Date(alert.timestamp).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* High Risk Batches */}
      {highRiskBatches.length > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <CardTitle className="text-white">Batch có nguy cơ cao</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highRiskBatches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-orange-500/5 border border-orange-500/20 hover:border-orange-500/40 transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-white mb-1">{batch.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>📍 {batch.location}</span>
                      <span>💧 Độ ẩm: {batch.humidity}%</span>
                      <span>🌡️ Nhiệt độ: {batch.temperature}°C</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-4">
                      <p className="text-sm text-slate-400">Tiến độ</p>
                      <p className="text-lg font-bold text-orange-400">{batch.dryingProgress}%</p>
                    </div>
                    <Link to={`/dashboard/batch/${batch.id}`}>
                      <Button variant="outline" size="sm" className="bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20">
                        Theo dõi
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}