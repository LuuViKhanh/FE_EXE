import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainChance: number;
  windSpeed: number;
  condition: string;
}

interface VoiceNotificationProps {
  weatherData: WeatherData;
}

export function VoiceNotification({ weatherData }: VoiceNotificationProps) {

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // dịch condition sang tiếng Việt
  const translateCondition = (condition: string) => {

    const map: Record<string, string> = {
      Clear: "Trời quang",
      Clouds: "Nhiều mây",
      Rain: "Mưa",
      Drizzle: "Mưa phùn",
      Thunderstorm: "Dông",
      Mist: "Sương mù",
      Fog: "Sương mù",
      Haze: "Sương nhẹ"
    };

    return map[condition] || condition;
  };

  const numberToVietnamese = (num: number) => {

    const ones = [
      "không","một","hai","ba","bốn","năm","sáu","bảy","tám","chín"
    ];

    const tens = [
      "","mười","hai mươi","ba mươi","bốn mươi",
      "năm mươi","sáu mươi","bảy mươi","tám mươi","chín mươi"
    ];

    if (num < 10) return ones[num];

    if (num < 100) {
      const t = Math.floor(num / 10);
      const o = num % 10;

      if (o === 0) return tens[t];
      return `${tens[t]} ${ones[o]}`;
    }

    return num.toString();
  };

  const readDecimal = (num: number) => {

    const parts = num.toFixed(1).split(".");

    const integerPart = numberToVietnamese(parseInt(parts[0]));
    const decimalPart = numberToVietnamese(parseInt(parts[1]));

    return `${integerPart} phẩy ${decimalPart}`;
  };

  const generateWeatherScript = () => {

    const riskLevel =
      weatherData.rainChance > 60 ? 'cao' :
      weatherData.rainChance > 30 ? 'trung bình' :
      'thấp';

    const humidityLevel =
      weatherData.humidity > 70 ? 'rất cao' :
      weatherData.humidity > 60 ? 'cao' :
      'bình thường';

    return `
Thông báo thời tiết khu vực phơi bánh tráng Mỹ Lồng.

Nhiệt độ hiện tại ${readDecimal(weatherData.temperature)} độ C.

Độ ẩm không khí ${numberToVietnamese(Math.round(weatherData.humidity))} phần trăm, ở mức ${humidityLevel}.

Khả năng mưa ${numberToVietnamese(Math.round(weatherData.rainChance))} phần trăm, mức độ rủi ro ${riskLevel}.

Tốc độ gió ${readDecimal(weatherData.windSpeed)} ki lô mét trên giờ.

Tình trạng thời tiết ${translateCondition(weatherData.condition)}.

${weatherData.rainChance > 60
  ? 'Cảnh báo. Nguy cơ mưa cao. Khuyến nghị chuẩn bị thu bánh hoặc che chắn.'
  : weatherData.rainChance > 30
  ? 'Lưu ý. Theo dõi sát diễn biến thời tiết trong giờ tới.'
  : 'Điều kiện phơi bánh ổn định. Có thể tiếp tục phơi an toàn.'}
`.trim();
  };

  const speakWeather = async () => {

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    const text = generateWeatherScript();

    try {
      const res = await fetch("/fpt-tts", {
        method: "POST",
        headers: {
          "api-key": "SMPEJpZLaQlKQtY6xUL9jmBlVzJfcYKW",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input: text, voice: "lannhi", speed: "", id: "1" })
      });

      const json = await res.json();
      if (json.error !== 0) throw new Error(json.message);

      // FPT trả về async URL, chờ file sẵn sàng
      await new Promise(r => setTimeout(r, 2000));

      const audio = new Audio(json.async);
      audioRef.current = audio;

      audio.onended = () => setIsPlaying(false);

      audio.play();
      setIsPlaying(true);
      toast.success("Đang phát thông báo thời tiết");

    } catch (e: any) {
      toast.error(`Lỗi TTS: ${e.message ?? "thử lại sau"}`);
    }

  };

  return (
    <Button
      onClick={speakWeather}
      className={`
        ${isPlaying
          ? 'bg-gradient-to-r from-red-500 to-rose-600'
          : 'bg-gradient-to-r from-cyan-500 to-blue-600'}
        text-white shadow-lg hover:shadow-xl transition-all
        border-none px-5 py-2.5 rounded-xl font-semibold
        flex items-center gap-2
      `}
    >

      {isPlaying ? (
        <>
          <VolumeX className="w-5 h-5" />
          <span>Dừng phát</span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5" />
          <span>Nghe thông báo thời tiết</span>
        </>
      )}

    </Button>
  );
}