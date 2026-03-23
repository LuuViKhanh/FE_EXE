import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Slider } from '../../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  Save, 
  RefreshCcw,
  Settings as SettingsIcon,
  Bell,
  Sliders,
  Database
} from 'lucide-react';
import { defaultAIConfig } from '../../data/adminMockData';
import { toast } from 'sonner';

export default function Settings() {
  const [aiConfig, setAiConfig] = useState(defaultAIConfig);

  const handleSave = () => {
    toast.success('Cài đặt đã được lưu thành công!');
  };

  const handleReset = () => {
    setAiConfig(defaultAIConfig);
    toast.info('Đã khôi phục cài đặt mặc định');
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Cài đặt hệ thống</h1>
          <p className="text-slate-400 mt-1">Cấu hình thông số và tùy chọn hệ thống</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Khôi phục mặc định
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="ai" className="space-y-6">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="ai" className="data-[state=active]:bg-blue-600">
            <Sliders className="w-4 h-4 mr-2" />
            Cấu hình AI
          </TabsTrigger>
          <TabsTrigger value="alerts" className="data-[state=active]:bg-blue-600">
            <Bell className="w-4 h-4 mr-2" />
            Cảnh báo
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-blue-600">
            <SettingsIcon className="w-4 h-4 mr-2" />
            Hệ thống
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-blue-600">
            <Database className="w-4 h-4 mr-2" />
            Dữ liệu
          </TabsTrigger>
        </TabsList>

        {/* AI Configuration */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Ngưỡng độ khô</CardTitle>
              <CardDescription className="text-slate-400">
                Thiết lập mức độ khô tối thiểu để batch được coi là hoàn thành
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="drying-threshold" className="text-slate-300">
                    Độ khô đạt chuẩn
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="drying-threshold"
                      type="number"
                      value={aiConfig.dryingThreshold}
                      onChange={(e) => setAiConfig({ ...aiConfig, dryingThreshold: Number(e.target.value) })}
                      className="w-20 bg-slate-800 border-slate-700 text-white"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
                <Slider
                  value={[aiConfig.dryingThreshold]}
                  onValueChange={([value]) => setAiConfig({ ...aiConfig, dryingThreshold: value })}
                  min={80}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="confidence-threshold" className="text-slate-300">
                    Ngưỡng độ tin cậy AI
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="confidence-threshold"
                      type="number"
                      value={aiConfig.confidenceThreshold}
                      onChange={(e) => setAiConfig({ ...aiConfig, confidenceThreshold: Number(e.target.value) })}
                      className="w-20 bg-slate-800 border-slate-700 text-white"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
                <Slider
                  value={[aiConfig.confidenceThreshold]}
                  onValueChange={([value]) => setAiConfig({ ...aiConfig, confidenceThreshold: value })}
                  min={70}
                  max={99}
                  step={1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Cảnh báo môi trường</CardTitle>
              <CardDescription className="text-slate-400">
                Thiết lập ngưỡng cảnh báo cho các yếu tố môi trường
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="humidity-warning" className="text-slate-300">
                    Cảnh báo độ ẩm cao
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="humidity-warning"
                      type="number"
                      value={aiConfig.humidityWarning}
                      onChange={(e) => setAiConfig({ ...aiConfig, humidityWarning: Number(e.target.value) })}
                      className="w-20 bg-slate-800 border-slate-700 text-white"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
                <Slider
                  value={[aiConfig.humidityWarning]}
                  onValueChange={([value]) => setAiConfig({ ...aiConfig, humidityWarning: value })}
                  min={50}
                  max={90}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rain-threshold" className="text-slate-300">
                    Ngưỡng nguy cơ mưa
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="rain-threshold"
                      type="number"
                      value={aiConfig.rainRiskThreshold}
                      onChange={(e) => setAiConfig({ ...aiConfig, rainRiskThreshold: Number(e.target.value) })}
                      className="w-20 bg-slate-800 border-slate-700 text-white"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                </div>
                <Slider
                  value={[aiConfig.rainRiskThreshold]}
                  onValueChange={([value]) => setAiConfig({ ...aiConfig, rainRiskThreshold: value })}
                  min={30}
                  max={90}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temp-min" className="text-slate-300">
                    Nhiệt độ tối thiểu
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="temp-min"
                      type="number"
                      value={aiConfig.temperatureMin}
                      onChange={(e) => setAiConfig({ ...aiConfig, temperatureMin: Number(e.target.value) })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                    <span className="text-slate-400">°C</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temp-max" className="text-slate-300">
                    Nhiệt độ tối đa
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="temp-max"
                      type="number"
                      value={aiConfig.temperatureMax}
                      onChange={(e) => setAiConfig({ ...aiConfig, temperatureMax: Number(e.target.value) })}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                    <span className="text-slate-400">°C</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Settings */}
        <TabsContent value="alerts" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Tùy chọn thông báo</CardTitle>
              <CardDescription className="text-slate-400">
                Quản lý cách hệ thống gửi cảnh báo và thông báo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-alert" className="text-white">
                    Cảnh báo tự động
                  </Label>
                  <p className="text-sm text-slate-400">
                    Tự động gửi cảnh báo khi phát hiện rủi ro
                  </p>
                </div>
                <Switch
                  id="auto-alert"
                  checked={aiConfig.autoAlertEnabled}
                  onCheckedChange={(checked) => setAiConfig({ ...aiConfig, autoAlertEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                <div className="space-y-0.5">
                  <Label htmlFor="voice-notification" className="text-white">
                    Thông báo giọng nói
                  </Label>
                  <p className="text-sm text-slate-400">
                    Kích hoạt thông báo bằng giọng nói AI
                  </p>
                </div>
                <Switch
                  id="voice-notification"
                  checked={aiConfig.voiceNotificationEnabled}
                  onCheckedChange={(checked) => setAiConfig({ ...aiConfig, voiceNotificationEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notification" className="text-white">
                    Thông báo Email
                  </Label>
                  <p className="text-sm text-slate-400">
                    Gửi email khi có cảnh báo quan trọng
                  </p>
                </div>
                <Switch id="email-notification" defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notification" className="text-white">
                    Thông báo đẩy
                  </Label>
                  <p className="text-sm text-slate-400">
                    Nhận thông báo đẩy trên thiết bị di động
                  </p>
                </div>
                <Switch id="push-notification" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Thông tin hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Phiên bản hệ thống</p>
                  <p className="text-white font-medium">v2.1.0</p>
                </div>
                <div>
                  <p className="text-slate-400">AI Model</p>
                  <p className="text-white font-medium">YOLOv8-custom-v3</p>
                </div>
                <div>
                  <p className="text-slate-400">Ngày cập nhật</p>
                  <p className="text-white font-medium">18/03/2026</p>
                </div>
                <div>
                  <p className="text-slate-400">Uptime</p>
                  <p className="text-green-400 font-medium">99.8%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Camera & Thiết bị</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                <div className="space-y-0.5">
                  <Label className="text-white">Tần suất quét camera</Label>
                  <p className="text-sm text-slate-400">Tần suất AI xử lý hình ảnh từ camera</p>
                </div>
                <Input
                  type="number"
                  defaultValue={5}
                  className="w-24 bg-slate-800 border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                <div className="space-y-0.5">
                  <Label className="text-white">Chất lượng video</Label>
                  <p className="text-sm text-slate-400">Độ phân giải stream từ camera</p>
                </div>
                <select className="px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white">
                  <option>1080p</option>
                  <option>720p</option>
                  <option>480p</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Settings */}
        <TabsContent value="data" className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Quản lý dữ liệu</CardTitle>
              <CardDescription className="text-slate-400">
                Cài đặt lưu trữ và sao lưu dữ liệu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50">
                <div className="space-y-0.5">
                  <Label className="text-white">Tự động sao lưu</Label>
                  <p className="text-sm text-slate-400">Sao lưu dữ liệu tự động hàng ngày</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Thời gian lưu trữ dữ liệu</Label>
                <select className="w-full px-3 py-2 rounded-md bg-slate-800 border border-slate-700 text-white">
                  <option>30 ngày</option>
                  <option>90 ngày</option>
                  <option>180 ngày</option>
                  <option>1 năm</option>
                  <option>Vĩnh viễn</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <Button variant="outline" className="w-full bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700">
                  <Database className="w-4 h-4 mr-2" />
                  Xuất dữ liệu
                </Button>
                <Button variant="outline" className="w-full bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20">
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  Xóa dữ liệu cũ
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Thống kê lưu trữ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Dung lượng đã sử dụng</span>
                  <span className="text-white font-medium">2.4 GB / 10 GB</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '24%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-sm">
                <div>
                  <p className="text-slate-400">Tổng số batch</p>
                  <p className="text-white font-medium text-lg">835</p>
                </div>
                <div>
                  <p className="text-slate-400">Hình ảnh camera</p>
                  <p className="text-white font-medium text-lg">12,450</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}