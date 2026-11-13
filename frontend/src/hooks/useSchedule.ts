import { apiUrl } from "../api";
import { useState, useEffect, useCallback } from "react";
import type { CalendarEvent, StudentScheduleItem } from "../types/calendar";
import { getAuthHeaders, isAuthenticated } from "../utils/auth";

export const useSchedule = () => {
  const [schedules, setSchedules] = useState<StudentScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedule = useCallback(async () => {
    if (!isAuthenticated()) {
      setSchedules([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(apiUrl("/api/schedule"), {
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setSchedules([]);
          return;
        }
        throw new Error(`Failed to fetch schedule (${res.status})`);
      }

      const data = await res.json();
      setSchedules(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching schedule:", err);
      setError(err.message || "Failed to load schedule");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const isScheduled = useCallback(
    (eventId?: string | number, title?: string, date?: string): boolean => {
      if (!schedules || schedules.length === 0) return false;

      return schedules.some((item) => {
        // Match by MongoDB ObjectId
        if (eventId && (item.eventId === eventId || item._id === eventId || item.event?._id === eventId)) {
          return true;
        }
        // Match by custom numeric event ID
        if (
          eventId !== undefined &&
          !isNaN(Number(eventId)) &&
          (item.eventCustomId === Number(eventId) || item.event?.id === Number(eventId))
        ) {
          return true;
        }
        // Match by title + date
        if (title && date && item.event?.title === title && item.event?.date === date) {
          return true;
        }
        return false;
      });
    },
    [schedules]
  );

  const addToSchedule = async (event: CalendarEvent): Promise<{ success: boolean; message: string }> => {
    try {
      const eventId = event._id || event.id;
      const res = await fetch(apiUrl("/api/schedule"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          eventId,
          event,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          return { success: true, message: "Event is already in your schedule." };
        }
        throw new Error(data.message || "Failed to add event to schedule");
      }

      // Refresh schedule list
      await fetchSchedule();
      return { success: true, message: data.message || "Added to your schedule!" };
    } catch (err: any) {
      console.error("Error in addToSchedule:", err);
      return { success: false, message: err.message || "Failed to add event" };
    }
  };

  const removeFromSchedule = async (
    eventIdOrScheduleId: string | number
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(apiUrl(`/api/schedule/${eventIdOrScheduleId}`), {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to remove event from schedule");
      }

      // Update state locally
      setSchedules((prev) =>
        prev.filter(
          (s) =>
            s._id !== eventIdOrScheduleId &&
            s.eventId !== eventIdOrScheduleId &&
            s.eventCustomId !== Number(eventIdOrScheduleId) &&
            s.event?._id !== eventIdOrScheduleId &&
            s.event?.id !== Number(eventIdOrScheduleId)
        )
      );

      return { success: true, message: data.message || "Removed from schedule!" };
    } catch (err: any) {
      console.error("Error in removeFromSchedule:", err);
      return { success: false, message: err.message || "Failed to remove event" };
    }
  };

  return {
    schedules,
    loading,
    error,
    isScheduled,
    addToSchedule,
    removeFromSchedule,
    refetch: fetchSchedule,
  };
};
