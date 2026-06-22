import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Syringe,
  Bug,
  Stethoscope,
  Calendar,
  Bell,
} from 'lucide-react';
import { usePetStore } from '../store/usePetStore';
import {
  formatDateCN,
  getMonthDays,
  getFirstDayOfMonth,
  isToday,
  isSameDay,
  parseDateLocal,
  isExpired,
  getTodayString,
} from '../utils/dateUtils';
import type { CalendarEvent } from '../types';

export default function MedicalCalendar() {
  const { currentCalendarEvents, currentPet } = usePetStore();
  const calendarEvents = currentCalendarEvents();
  const pet = currentPet();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDays = getMonthDays(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (day: number): CalendarEvent[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter((event) => isSameDay(event.date, dateStr));
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'vaccine':
        return 'bg-primary-500';
      case 'deworm':
        return 'bg-accent-500';
      case 'recheck':
        return 'bg-warning-500';
      case 'visit':
        return 'bg-purple-500';
      default:
        return 'bg-surface-400';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'vaccine':
        return <Syringe className="w-3 h-3" />;
      case 'deworm':
        return <Bug className="w-3 h-3" />;
      case 'recheck':
        return <Stethoscope className="w-3 h-3" />;
      case 'visit':
        return <Stethoscope className="w-3 h-3" />;
      default:
        return <Calendar className="w-3 h-3" />;
    }
  };

  const todayStr = getTodayString();
  const todayDate = parseDateLocal(todayStr);

  const upcomingEvents = calendarEvents
    .filter((event) => {
      const eventDate = parseDateLocal(event.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() >= todayDate.getTime();
    })
    .sort(
      (a, b) =>
        parseDateLocal(a.date).getTime() - parseDateLocal(b.date).getTime()
    )
    .slice(0, 5);

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= monthDays; i++) {
    days.push(i);
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-24">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-surface-200 z-40">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center">
          <h1 className="font-semibold text-surface-800 text-lg">医疗日历</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 transition-colors"
              onClick={prevMonth}
            >
              <ChevronLeft className="w-5 h-5 text-surface-600" />
            </button>
            <h2 className="font-semibold text-surface-800 text-lg">
              {year}年{month + 1}月
            </h2>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-100 transition-colors"
              onClick={nextMonth}
            >
              <ChevronRight className="w-5 h-5 text-surface-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs text-surface-400 h-8 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="h-12" />;
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const events = getEventsForDate(day);
              const hasEvents = events.length > 0;
              const isCurrentDay = isToday(dateStr);

              return (
                <div
                  key={day}
                  className={`h-12 flex flex-col items-center justify-center rounded-xl text-sm transition-colors ${
                    isCurrentDay
                      ? 'bg-primary-500 text-white font-semibold'
                      : hasEvents
                      ? 'bg-primary-50 text-surface-700'
                      : 'text-surface-600 hover:bg-surface-50'
                  }`}
                >
                  <span className="mb-0.5">{day}</span>
                  {hasEvents && (
                    <div className="flex gap-0.5">
                      {events.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className={`w-1.5 h-1.5 rounded-full ${getEventColor(event.type)}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
              <span className="text-xs text-surface-500">疫苗</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-500" />
              <span className="text-xs text-surface-500">驱虫</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              <span className="text-xs text-surface-500">就诊</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-warning-500" />
              <span className="text-xs text-surface-500">复诊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-warning-500" />
            <h3 className="font-semibold text-surface-800">即将到来</h3>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="text-center py-6 text-surface-400">
              <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无即将到来的医疗事件</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-3 bg-surface-50 rounded-xl"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${getEventColor(event.type)}`}
                  >
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-surface-800 text-sm">
                      {event.title}
                    </h4>
                    <p className="text-xs text-surface-500">{event.description}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-surface-700">
                      {formatDateCN(event.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
