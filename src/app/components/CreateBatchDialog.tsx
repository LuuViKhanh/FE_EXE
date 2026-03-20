import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Plus, CalendarIcon, Loader2, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';
import { useSystem } from '../contexts/SystemContext';

interface CreateBatchDialogProps {
  onBatchCreated?: () => void;
}

export function CreateBatchDialog({ onBatchCreated }: CreateBatchDialogProps) {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const { setIsAnalyzing } = useSystem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsCreating(true);
    
    // Simulate AI initialization and batch creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate batch ID
    const batchId = `2024-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
    
    // Store in localStorage to simulate persistence
    const newBatch = {
      id: Date.now().toString(),
      name: `Batch #${batchId}`,
      startTime: date.toISOString(),
      location,
      notes,
      dryingProgress: 0,
      estimatedTimeRemaining: 360,
      riskLevel: 'low' as const,
      status: 'active' as const,
      temperature: 30,
      humidity: 60,
      weatherRisk: 'Đang đánh giá...',
    };
    
    // Simulate starting AI analysis
    setIsAnalyzing(true);
    
    toast.success(
      <div>
        <div className="font-semibold">Batch #{batchId} đã được tạo</div>
        <div className="text-sm text-muted-foreground mt-1">
          Hệ thống AI đang bắt đầu giám sát. Tải lại trang để xem batch mới.
        </div>
      </div>,
      {
        duration: 5000,
      }
    );
    
    // Stop analyzing indicator after a moment
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
    
    setIsCreating(false);
    setOpen(false);
    
    // Reset form
    setLocation('');
    setNotes('');
    setDate(new Date());
    
    if (onBatchCreated) {
      onBatchCreated();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-[#2A5C6F] to-[#1E4558] hover:from-[#1E4558] hover:to-[#2A5C6F]">
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Tạo Batch Mới</span>
          <span className="sm:hidden">Tạo Batch</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo Batch Phơi Mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin để bắt đầu theo dõi mẻ phơi bánh tráng mới
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Ngày phơi</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'PPP', { locale: vi })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Vị trí phơi</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="VD: Sân phơi A1, Khu vực 2"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="pl-9"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="notes"
              placeholder="Thông tin bổ sung về mẻ phơi này..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isCreating}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="flex-1 bg-gradient-to-r from-[#2A5C6F] to-[#1E4558]"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang khởi tạo...
                </>
              ) : (
                'Bắt đầu theo dõi'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
