'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  priority: string;
  createdAt: string;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?status=unread');
      if (!response.ok) throw new Error('Erro ao carregar notificações');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
      toast.error('Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Atualiza as notificações a cada 5 minutos
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'read' }),
      });

      if (!response.ok) throw new Error('Erro ao marcar notificação como lida');
      
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notificação marcada como lida');
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
      toast.error('Erro ao marcar notificação como lida');
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="relative rounded-full p-1 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
          aria-label="Notificações"
        >
          <Bell className="h-6 w-6" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {notifications.length}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="z-50 min-w-[320px] overflow-hidden rounded-md border border-slate-200 bg-white p-1 shadow-md"
          align="end"
        >
          <div className="px-2 py-1.5 text-sm font-medium text-slate-900">
            Notificações
          </div>
          <DropdownMenu.Separator className="my-1 h-px bg-slate-200" />
          
          {loading ? (
            <div className="p-2 text-sm text-slate-500">Carregando...</div>
          ) : notifications.length === 0 ? (
            <div className="p-2 text-sm text-slate-500">
              Nenhuma notificação não lida
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenu.Item
                key={notification._id}
                className="relative flex cursor-default select-none flex-col gap-1 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100"
                onSelect={() => markAsRead(notification._id)}
              >
                <div className="font-medium text-slate-900">
                  {notification.title}
                </div>
                <div className="text-slate-500">{notification.message}</div>
                <div className="text-xs text-slate-400">
                  {new Date(notification.createdAt).toLocaleString()}
                </div>
              </DropdownMenu.Item>
            ))
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
} 