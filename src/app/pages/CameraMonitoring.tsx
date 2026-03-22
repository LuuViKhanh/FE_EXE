import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useSystem } from "../contexts/SystemContext";
import { useWeather } from "../hooks/useWeather";
import {
  Camera,
  Thermometer,
  Droplets,
  TrendingUp,
  AlertTriangle,
  Cloud,
  CloudRain,
  Clock,
  Activity,
  CheckCircle2,
  Info,
  Upload,
  Scan,
  Tag,
  Crosshair,
} from "lucide-react";

interface LogEntry {
  time: string;
  message: string;
  type: "info" | "warning" | "success" | "alert";
}

export default function CameraMonitoring() {
  const { activeBatch, isDetecting } = useSystem();
  const { currentWeather } = useWeather();
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      time: "13:00",
      message: "Mẻ bánh bắt đầu - AI Vision phát hiện bánh tráng",
      type: "success",
    },
    {
      time: "14:15",
      message: "Độ khô đạt 45% - Tiến độ tốt",
      type: "info",
    },
    {
      time: "15:00",
      message: "Độ ẩm tăng nhẹ",
      type: "warning",
    },
  ]);

  const [cameraFeed, setCameraFeed] = useState(0);

  // Simulate camera feed refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setCameraFeed((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Add logs when batch progresses
  useEffect(() => {
    if (!activeBatch) return;

    const logInterval = setInterval(() => {
      const dryness = Math.round(activeBatch.dryness);
      const humidity = Math.round(activeBatch.humidity);

      if (
        dryness > 0 &&
        dryness % 20 === 0 &&
        Math.random() > 0.7
      ) {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

        let message = "";
        let type: "info" | "warning" | "success" | "alert" =
          "info";

        if (dryness >= 80) {
          message = `Độ khô đạt ${dryness}% - Sắp hoàn thành`;
          type = "success";
        } else if (humidity > 60) {
          message = `Độ ẩm cao ${humidity}% - Giám sát chặt`;
          type = "warning";
        } else {
          message = `Độ khô đạt ${dryness}% - Tiến độ tốt`;
          type = "info";
        }

        setLogs((prev) => [
          {
            time: timeStr,
            message,
            type,
          },
          ...prev.slice(0, 9),
        ]);
      }
    }, 5000);

    return () => clearInterval(logInterval);
  }, [activeBatch]);

  const getLogIcon = (type: string) => {
    switch (type) {
      case "success":
        return (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        );
      case "warning":
        return (
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        );
      case "alert":
        return (
          <AlertTriangle className="w-4 h-4 text-red-400" />
        );
      default:
        return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getLogStyle = (type: string) => {
    switch (type) {
      case "success":
        return "border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.05)]";
      case "warning":
        return "border-amber-500/30 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.05)]";
      case "alert":
        return "border-red-500/30 bg-red-500/10 shadow-[0_0_10px_rgba(239,68,68,0.05)]";
      default:
        return "border-cyan-500/30 bg-cyan-500/10 shadow-[0_0_10px_rgba(6,182,212,0.05)]";
    }
  };

  // Risk assessment based on real weather data
  const getRiskLevel = () => {
    if (!activeBatch) return null;
    const now = new Date();
    const hour = now.getHours();
    const nextHour = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 2).toString().padStart(2, '0')}:00`;

    if (currentWeather.rainChance > 60) {
      return {
        level: "high",
        message: "Cảnh báo mưa",
        timeRange: nextHour,
        description: `Khả năng mưa ${currentWeather.rainChance}% - Chuẩn bị thu bánh`,
      };
    } else if (currentWeather.rainChance > 30 || currentWeather.humidity > 70) {
      return {
        level: "medium",
        message: "Độ ẩm cao",
        timeRange: nextHour,
        description: `Độ ẩm ${currentWeather.humidity}%, mưa ${currentWeather.rainChance}% - Giám sát chặt`,
      };
    }
    return {
      level: "low",
      message: "Điều kiện tốt",
      timeRange: nextHour,
      description: `Nhiệt độ ${currentWeather.temperature.toFixed(1)}°C, độ ẩm ${currentWeather.humidity}% - Thuận lợi`,
    };
  };

  const riskInfo = getRiskLevel();

  // --- Roboflow Demo ---
  const rfFileInputRef = useRef<HTMLInputElement>(null);
  const [rfPreviewUrl, setRfPreviewUrl] = useState<string | null>(null);
  const [rfLoading, setRfLoading] = useState(false);
  const [rfError, setRfError] = useState<string | null>(null);
  const [rfResult, setRfResult] = useState<{ count: number; predictions: { class: string; confidence: number }[]; visualizationUrl?: string } | null>(null);

  const detectBanhTrangFromCanvas = (file: File): Promise<{ count: number; visualizationUrl: string }> => { return new Promise((resolve) => { const img = new Image(); const url = URL.createObjectURL(file); img.onload = () => { const canvas = document.createElement("canvas"); const scale = Math.min(1, 400 / Math.max(img.width, img.height)); canvas.width = Math.floor(img.width * scale); canvas.height = Math.floor(img.height * scale); const ctx = canvas.getContext("2d")!; ctx.drawImage(img, 0, 0, canvas.width, canvas.height); const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height); const totalPixels = width * height; const scoreMap = new Float32Array(totalPixels); for (let i = 0; i < data.length; i += 4) { const r = data[i], g = data[i+1], b = data[i+2]; scoreMap[i/4] = Math.max(0, (r+g+b)/3 - (r-b)*2); } const blurR = Math.floor(Math.min(width, height) * 0.08); const tmp = new Float32Array(totalPixels); const blurred = new Float32Array(totalPixels); for (let y = 0; y < height; y++) { let sum = 0, cnt = 0; for (let x = 0; x < width; x++) { sum += scoreMap[y*width+x]; cnt++; if (x > blurR) { sum -= scoreMap[y*width+x-blurR-1]; cnt--; } tmp[y*width+x] = sum/cnt; } } for (let x = 0; x < width; x++) { let sum = 0, cnt = 0; for (let y = 0; y < height; y++) { sum += tmp[y*width+x]; cnt++; if (y > blurR) { sum -= tmp[(y-blurR-1)*width+x]; cnt--; } blurred[y*width+x] = sum/cnt; } } const searchR = Math.floor(Math.min(width, height) * 0.14); const step = Math.floor(searchR * 0.3); const peaks: { x: number; y: number; val: number }[] = []; for (let y = searchR; y < height-searchR; y += step) { for (let x = searchR; x < width-searchR; x += step) { const val = blurred[y*width+x]; let isMax = true; for (let dy = -searchR; dy <= searchR && isMax; dy += Math.floor(searchR*0.5)) { for (let dx = -searchR; dx <= searchR && isMax; dx += Math.floor(searchR*0.5)) { if (dy===0 && dx===0) continue; const ny=y+dy, nx=x+dx; if (ny>=0 && ny<height && nx>=0 && nx<width) if (blurred[ny*width+nx] > val) isMax = false; } } if (isMax) peaks.push({ x, y, val }); } } peaks.sort((a,b) => b.val-a.val); const selected: typeof peaks = []; for (const p of peaks) { if (!selected.some(s => Math.hypot(p.x-s.x, p.y-s.y) < searchR*1.0)) selected.push(p); if (selected.length >= 5) break; } const topVal = selected[0]?.val ?? 0; const finalPeaks = selected.filter(p => p.val >= topVal * 0.60).slice(0, 5); const globalVisited = new Uint8Array(totalPixels); const final: { minX: number; minY: number; maxX: number; maxY: number }[] = []; for (const peak of finalPeaks) { const peakThresh = blurred[peak.y*width+peak.x] * 0.68; const stack = [peak.y*width+peak.x]; let minX=width, minY=height, maxX=0, maxY=0; while (stack.length) { const idx = stack.pop()!; if (idx<0||idx>=totalPixels||globalVisited[idx]) continue; if (blurred[idx] < peakThresh) continue; globalVisited[idx]=1; const x=idx%width, y=Math.floor(idx/width); if (x<minX) minX=x; if (x>maxX) maxX=x; if (y<minY) minY=y; if (y>maxY) maxY=y; if (x>0) stack.push(idx-1); if (x<width-1) stack.push(idx+1); stack.push(idx-width, idx+width); } if (maxX>minX && maxY>minY) final.push({ minX, minY, maxX, maxY }); } ctx.lineWidth = 3; ctx.font = "bold 14px monospace"; final.forEach((b, idx) => { ctx.strokeStyle="#00e5ff"; ctx.fillStyle="rgba(0,229,255,0.12)"; ctx.strokeRect(b.minX,b.minY,b.maxX-b.minX,b.maxY-b.minY); ctx.fillRect(b.minX,b.minY,b.maxX-b.minX,b.maxY-b.minY); ctx.fillStyle="#00e5ff"; ctx.fillText("Banh "+(idx+1), b.minX+4, b.minY+16); }); URL.revokeObjectURL(url); resolve({ count: final.length, visualizationUrl: canvas.toDataURL("image/jpeg", 0.9) }); }; img.src = url; }); };
const handleRoboflowUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRfPreviewUrl(URL.createObjectURL(file));
    setRfError(null);
    setRfResult(null);
    setRfLoading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const response = await fetch("https://serverless.roboflow.com/huntrots-workspace/workflows/detect-count-and-visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: "tp6EAAwS0YFOHfXZsvSo",
          inputs: { image: { type: "base64", value: base64 } },
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const outputs = Array.isArray(data?.outputs) ? data.outputs[0] : data;
      const detectResult = outputs?.detect_BanhTrang;
      const predictions: any[] = detectResult?.predictions ?? [];
      const vizVal = outputs?.MyLong;
      const visualizationUrl = vizVal?.value ? `data:image/jpeg;base64,${vizVal.value}` : undefined;
      const rfCount = predictions.length;
      if (rfCount === 0) {
        const fallback = await detectBanhTrangFromCanvas(file);
        setRfResult({ count: fallback.count, predictions: [], visualizationUrl: fallback.visualizationUrl });
      } else {
        setRfResult({ count: rfCount, predictions, visualizationUrl });
      }
    } catch (err: any) {
      setRfError(err.message ?? "Lỗi kết nối Roboflow");
    } finally {
      setRfLoading(false);
    }
  };
  // --- End Roboflow Demo ---

  // --- YOLO Demo ---
  const yoloFileInputRef = useRef<HTMLInputElement>(null);
  const [yoloPreviewUrl, setYoloPreviewUrl] = useState<string | null>(null);
  const [yoloLoading, setYoloLoading] = useState(false);
  const [yoloError, setYoloError] = useState<string | null>(null);
  const [yoloResult, setYoloResult] = useState<{ count: number; detections: { label: string; confidence: number; bbox: number[] }[]; imageUrl?: string } | null>(null);

  const handleYoloUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setYoloPreviewUrl(URL.createObjectURL(file));
    setYoloError(null);
    setYoloResult(null);
    setYoloLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/yolo-api/ai/detect', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const raw = data.objects ?? data.detections ?? data.predictions ?? data.results ?? [];
      const detections = raw.map((d: any) => ({
        label: d.label ?? ({ 0: 'Bánh tráng mè trắng', 1: 'Bánh tráng mè đen' }[d.class as 0|1] ?? `Class ${d.class}`),
        confidence: d.confidence,
        bbox: d.bbox ?? [],
      }));
      const imageUrl: string | undefined = data.image ? `data:image/jpeg;base64,${data.image}` : data.image_url ?? undefined;
      setYoloResult({ count: detections.length, detections, imageUrl });
    } catch (err: any) {
      setYoloError(err.message ?? 'Lỗi kết nối YOLO API');
    } finally {
      setYoloLoading(false);
    }
  };
  // --- End YOLO Demo ---

  // --- Realtime Camera YOLO ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [realtimeDetections, setRealtimeDetections] = useState<{ label: string; confidence: number; bbox: number[] }[]>([]);
  const [realtimeError, setRealtimeError] = useState<string | null>(null);
  const [realtimeLoading, setRealtimeLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const drawDetections = useCallback((detections: { label: string; confidence: number; bbox: number[] }[]) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    detections.forEach((d) => {
      const [x1, y1, x2, y2] = d.bbox;
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
      ctx.fillStyle = "rgba(0,229,255,0.15)";
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
      ctx.fillStyle = "#00e5ff";
      ctx.font = "bold 13px monospace";
      const conf = d.confidence <= 1 ? Math.round(d.confidence * 100) : Math.round(d.confidence);
      ctx.fillText(`${d.label} ${conf}%`, x1 + 4, y1 + 16);
    });
  }, []);

  const captureAndDetect = useCallback(async () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;
    const snap = document.createElement("canvas");
    snap.width = video.videoWidth;
    snap.height = video.videoHeight;
    snap.getContext("2d")?.drawImage(video, 0, 0);
    const base64 = snap.toDataURL("image/jpeg", 0.8).split(",")[1];
    setIsScanning(true);
    try {
      const res = await fetch("/yolo-api/ai/detect-realtime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const raw: any[] = data.objects ?? [];
      const dets = raw.map((d) => ({
        label: d.label ?? ({ 0: "Bánh tráng mè trắng", 1: "Bánh tráng mè đen" }[d.class as 0 | 1] ?? `Class ${d.class}`),
        confidence: d.confidence,
        bbox: d.bbox ?? [],
      }));
      setRealtimeDetections(dets.length > 0 ? dets : prev => prev);
      if (dets.length > 0) drawDetections(dets);
    } catch { /* silent */ }
    finally { setIsScanning(false); }
  }, [drawDetections]);

  const loopRef = useRef(false);

  const detectLoop = useCallback(async () => {
    if (!loopRef.current) return;
    await captureAndDetect();
    if (loopRef.current) intervalRef.current = setTimeout(detectLoop, 1500) as any;
  }, [captureAndDetect]);

  const startCamera = async () => {
    setRealtimeError(null);
    setRealtimeLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
      loopRef.current = true;
      detectLoop();
    } catch (err: any) {
      setRealtimeError(err.message ?? "Không thể truy cập camera");
    } finally {
      setRealtimeLoading(false);
    }
  };

  const stopCamera = () => {
    loopRef.current = false;
    if (intervalRef.current) clearTimeout(intervalRef.current as any);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraActive(false);
    setRealtimeDetections([]);
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => () => stopCamera(), []);
  // --- End Realtime Camera YOLO ---

  return (
    <div className="max-w-7xl mx-auto space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Camera & Live Monitoring
          </h1>
          <p className="text-sm md:text-base text-slate-400">
            Theo dõi quá trình phơi bánh real-time
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-emerald-400">
            LIVE
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-800 bg-[#151E2F] shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden">
            <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-cyan-400" />
                  <span>Camera AI Vision</span>
                </div>
                <Badge
                  className={`${isDetecting ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]" : activeBatch ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-slate-800 text-slate-400 border-slate-700"}`}
                >
                  {isDetecting
                    ? "Đang quét..."
                    : activeBatch
                      ? "Đang theo dõi"
                      : "Chế độ chờ"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative aspect-video bg-[#0B1121] overflow-hidden">
                {/* Simulated Camera Feed */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Grid overlay for camera effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0B1121]/80 z-10" />
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 z-10">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className="border border-cyan-500/5"
                        />
                      ))}
                    </div>

                    {/* Simulated scene */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                      {activeBatch ? (
                        <>
                          {/* Bánh tráng simulation */}
                          <div className="absolute inset-0 flex items-center justify-center p-12">
                            <div className="relative w-full h-full max-w-2xl max-h-96">
                              {/* Main circle representing bánh tráng */}
                              <div
                                className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-100/20 via-yellow-50/10 to-amber-200/20 shadow-2xl opacity-80"
                                style={{
                                  filter: `brightness(${0.8 + activeBatch.dryness / 500})`,
                                }}
                              />

                              {/* Texture overlay */}
                              <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                  background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,${0.1 - activeBatch.dryness / 1000}) 0%, transparent 50%)`,
                                }}
                              />

                              {/* Detection box */}
                              <div className="absolute inset-0 border border-emerald-400/50 rounded-full animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                <div className="absolute -top-6 left-0 bg-emerald-500 text-white text-xs px-2 py-1 rounded font-mono shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                  BATCH DETECTED
                                </div>
                              </div>

                              {/* Dryness indicator on image */}
                              <div className="absolute bottom-4 right-4 bg-[#0B1121]/90 backdrop-blur-md px-3 py-2 rounded-lg border border-emerald-500/30">
                                <div className="text-emerald-400 text-xs font-mono">
                                  Dryness:{" "}
                                  {Math.round(
                                    activeBatch.dryness,
                                  )}
                                  %
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-3">
                            <Camera className="w-16 h-16 text-slate-700 mx-auto" />
                            <p className="text-slate-500 font-mono text-sm">
                              Waiting for detection...
                            </p>
                            {isDetecting && (
                              <div className="flex items-center gap-2 justify-center">
                                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                <span className="text-cyan-400 text-xs">
                                  Scanning...
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Camera info overlay */}
                    <div className="absolute top-4 left-4 bg-[#0B1121]/80 backdrop-blur-md px-3 py-2 rounded-lg z-20 font-mono text-xs text-slate-300 space-y-1 border border-slate-800">
                      <div>CAM-01 | ZONE-A</div>
                      <div className="text-cyan-400">
                        {new Date().toLocaleTimeString("vi-VN")}
                      </div>
                    </div>

                    {/* Recording indicator */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/20 border border-red-500/30 backdrop-blur-md px-3 py-1.5 rounded-lg z-20">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                      <span className="text-red-400 text-xs font-semibold">
                        REC
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monitoring Log */}
          <Card className="border-slate-800 bg-[#151E2F] shadow-md">
            <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg text-white">
                <Clock className="w-5 h-5 text-cyan-400" />
                Lịch sử theo dõi mẻ bánh
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${getLogStyle(log.type)}`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {getLogIcon(log.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-semibold text-slate-400 bg-[#0B1121] px-2 py-0.5 rounded border border-slate-800">
                            {log.time}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {log.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 text-slate-700" />
                    <p>Chưa có log nào</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metrics & Risk Panel */}
        <div className="space-y-6">
          {/* Current Metrics */}
          <Card className="border-slate-800 bg-[#151E2F] shadow-md">
            <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
              <CardTitle className="text-base md:text-lg text-white">
                Chỉ số hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-5 space-y-4 pt-5">
              {activeBatch ? (
                <>
                  {/* Temperature */}
                  <div className="p-4 bg-[#0B1121] rounded-xl border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                          <Thermometer className="w-5 h-5 text-orange-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">
                          Nhiệt độ
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {currentWeather.temperature.toFixed(1)}°C
                    </div>
                  </div>

                  {/* Humidity */}
                  <div className="p-4 bg-[#0B1121] rounded-xl border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
                          <Droplets className="w-5 h-5 text-cyan-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">
                          Độ ẩm
                        </span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-white">
                      {currentWeather.humidity}%
                    </div>
                  </div>

                  {/* Estimated Completion Time */}
                  <div className="p-4 bg-[#0B1121] rounded-xl border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-violet-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">
                          Dự kiến hoàn thành
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-white">
                        {activeBatch.estimatedCompletion.toLocaleTimeString('vi-VN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        Còn {Math.floor(activeBatch.timeRemaining / 60)}h {activeBatch.timeRemaining % 60}p
                      </div>
                    </div>
                  </div>

                  {/* Dryness Progress */}
                  <div className="p-4 bg-[#0B1121] rounded-xl border border-slate-800 shadow-inner">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-sm font-medium text-slate-400">
                          Độ khô
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                        {Math.round(activeBatch.dryness)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] transition-all duration-500"
                        style={{
                          width: `${activeBatch.dryness}%`,
                        }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-slate-400 font-medium">
                      {activeBatch.dryness < 50
                        ? "Giai đoạn đầu"
                        : activeBatch.dryness < 80
                          ? "Đang khô nhanh"
                          : "Sắp hoàn thành"}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">
                    Chưa có batch đang hoạt động
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    Camera đang standby...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Risk Alert Box */}
          {riskInfo && (
            <Card
              className={`border shadow-[0_4px_20px_rgba(0,0,0,0.2)] bg-[#151E2F] ${
                riskInfo.level === "high"
                  ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                  : riskInfo.level === "medium"
                    ? "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                    : "border-emerald-500/30"
              }`}
            >
              <CardHeader
                className={`border-b border-slate-800 pb-3 bg-[#0B1121]/50`}
              >
                <CardTitle className="text-base flex items-center gap-2">
                  {riskInfo.level === "high" ? (
                    <CloudRain className="w-5 h-5 text-red-400" />
                  ) : riskInfo.level === "medium" ? (
                    <Cloud className="w-5 h-5 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  <span className="text-white">Risk Alert</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-lg font-bold ${
                        riskInfo.level === "high"
                          ? "text-red-400"
                          : riskInfo.level === "medium"
                            ? "text-amber-400"
                            : "text-emerald-400"
                      }`}
                    >
                      {riskInfo.message}
                    </span>
                    <Badge
                      className={
                        riskInfo.level === "high"
                          ? "bg-red-500/10 text-red-400 border-red-500/30"
                          : riskInfo.level === "medium"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      }
                    >
                      {riskInfo.level === "high"
                        ? "Cao"
                        : riskInfo.level === "medium"
                          ? "Trung bình"
                          : "Thấp"}
                    </Badge>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-400">
                    {riskInfo.description}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-800 bg-[#0B1121]">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock
                      className={`w-4 h-4 ${
                        riskInfo.level === "high"
                          ? "text-red-400"
                          : riskInfo.level === "medium"
                            ? "text-amber-400"
                            : "text-emerald-400"
                      }`}
                    />
                    <span className="text-xs font-semibold text-slate-400">
                      Khung giờ
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">
                    {riskInfo.timeRange}
                  </p>
                </div>

                {riskInfo.level !== "low" && (
                  <div
                    className={`flex items-start gap-2 p-3 rounded-lg border ${
                      riskInfo.level === "high"
                        ? "bg-red-500/10 border-red-500/20"
                        : "bg-amber-500/10 border-amber-500/20"
                    }`}
                  >
                    <AlertTriangle
                      className={`w-4 h-4 mt-0.5 ${
                        riskInfo.level === "high"
                          ? "text-red-400"
                          : "text-amber-400"
                      }`}
                    />
                    <p
                      className={`text-xs ${
                        riskInfo.level === "high"
                          ? "text-red-200"
                          : "text-amber-200"
                      }`}
                    >
                      {riskInfo.level === "high"
                        ? "Khuyến nghị: Chuẩn bị thu bánh nếu tình hình xấu đi"
                        : "Khuyến nghị: Theo dõi sát và chuẩn bị phương án dự phòng"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Realtime Camera YOLO */}
      <Card className="border-slate-800 bg-[#151E2F] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" />
              YOLO – Camera Realtime
            </div>
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              disabled={realtimeLoading}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                cameraActive
                  ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                  : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30"
              } disabled:opacity-50`}
            >
              {realtimeLoading ? "Đang kết nối..." : cameraActive ? "Dừng camera" : "Bật camera"}
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Video + Canvas overlay */}
            <div className="relative bg-[#0B1121] rounded-xl overflow-hidden border border-slate-800 aspect-video flex items-center justify-center">
              {!cameraActive && !realtimeLoading && (
                <div className="text-center text-slate-600">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Nhấn "Bật camera" để bắt đầu</p>
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? "" : "hidden"}`}
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
              {cameraActive && (
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-[#0B1121]/80 px-2 py-1 rounded text-xs font-mono text-cyan-400 border border-cyan-500/20">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  LIVE DETECT
                </div>
              )}
              {isScanning && (
                <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-orange-500/20 px-2 py-1 rounded text-xs font-mono text-orange-400 border border-orange-500/30">
                  <Scan className="w-3 h-3 animate-spin" />
                  SCANNING...
                </div>
              )}
            </div>
            {/* Detection results */}
            <div className="space-y-3">
              {realtimeError && (
                <div className="flex items-center gap-2 text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {realtimeError}
                </div>
              )}
              {cameraActive && (
                <div className="p-4 bg-[#0B1121] rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Đang phát hiện</p>
                  <div className="text-3xl font-bold text-cyan-400">{realtimeDetections.length}</div>
                  <p className="text-sm text-slate-400 mt-1">đối tượng trong khung hình</p>
                </div>
              )}
              {realtimeDetections.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Chi tiết</p>
                  {realtimeDetections.slice(0, 8).map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-[#0B1121] rounded-lg border border-slate-800">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-slate-200">{d.label}</span>
                      </div>
                      <Badge className={`text-xs ${
                        d.confidence >= 0.9 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : d.confidence >= 0.75 ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                        : "bg-slate-700 text-slate-400 border-slate-600"
                      }`}>
                        {d.confidence <= 1 ? Math.round(d.confidence * 100) : Math.round(d.confidence)}%
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              {cameraActive && realtimeDetections.length === 0 && (
                <div className="text-center py-6 text-slate-600">
                  <Scan className="w-8 h-8 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm">Đang quét... chưa phát hiện đối tượng</p>
                </div>
              )}
              {!cameraActive && !realtimeError && (
                <div className="text-center py-8 text-slate-600">
                  <Crosshair className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">Bật camera để detect realtime bằng YOLO</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* YOLO Demo */}
      <Card className="border-slate-800 bg-[#151E2F] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
        <CardHeader className="border-b border-slate-800 bg-[#151E2F]">
          <CardTitle className="flex items-center gap-2 text-white">
            <Crosshair className="w-5 h-5 text-orange-400" />
            YOLO – Phát hiện đối tượng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div
                onClick={() => yoloFileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-700 hover:border-orange-500/50 rounded-xl p-8 cursor-pointer transition-colors bg-[#0B1121] hover:bg-orange-500/5"
              >
                <Upload className="w-10 h-10 text-slate-600" />
                <p className="text-sm text-slate-400">Click để upload ảnh</p>
                <p className="text-xs text-slate-600">JPG, PNG, WEBP</p>
                <input ref={yoloFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleYoloUpload} />
              </div>
              {yoloPreviewUrl && !yoloResult?.imageUrl && (
                <img src={yoloPreviewUrl} alt="preview" className="w-full rounded-xl border border-slate-700 object-cover max-h-64" />
              )}
              {yoloResult?.imageUrl && (
                <img src={yoloResult.imageUrl} alt="yolo visualization" className="w-full rounded-xl border border-slate-700 object-cover" />
              )}
            </div>
            <div className="space-y-3">
              {yoloError && (
                <div className="flex items-center gap-2 text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  {yoloError}
                </div>
              )}
              {yoloLoading && (
                <div className="flex items-center gap-3 text-orange-400 py-4">
                  <Scan className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Đang phân tích với YOLO...</span>
                </div>
              )}
              {yoloResult && (
                <>
                  <div className="p-4 bg-[#0B1121] rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Kết quả phát hiện</p>
                    <div className="text-3xl font-bold text-orange-400">{yoloResult.count}</div>
                    <p className="text-sm text-slate-400 mt-1">đối tượng được phát hiện</p>
                  </div>
                  {yoloResult.detections.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Chi tiết nhãn</p>
                      {yoloResult.detections.slice(0, 8).map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-[#0B1121] rounded-lg border border-slate-800">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-slate-200">{d.label}</span>
                          </div>
                          <Badge className={`text-xs ${
                            d.confidence >= 0.9 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : d.confidence >= 0.75 ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
                            : "bg-slate-700 text-slate-400 border-slate-600"
                          }`}>
                            {d.confidence <= 1 ? Math.round(d.confidence * 100) : Math.round(d.confidence)}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
              {!yoloLoading && !yoloError && !yoloResult && (
                <div className="text-center py-8 text-slate-600">
                  <Crosshair className="w-10 h-10 mx-auto mb-2" />
                  <p className="text-sm">Upload ảnh để bắt đầu phân tích YOLO</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}