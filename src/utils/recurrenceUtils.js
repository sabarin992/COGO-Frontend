export const RECURRENCE_OPTIONS = [
  {
    id: "ONCE",
    label: "Once",
    description: "Ride happens only once on the selected date",
  },
  {
    id: "DAILY",
    label: "Every Day",
    description: "Repeats every calendar day within the date range",
  },
  {
    id: "WEEKDAYS",
    label: "Monday to Friday",
    description: "Repeats on weekdays only (excludes Saturday & Sunday)",
  },
  {
    id: "SHIFT",
    label: "Shift Workdays",
    description: "Custom rotating shift cycle (e.g. 2 work days / 2 off days)",
  },
  {
    id: "CUSTOM",
    label: "Custom",
    description: "Select specific weekdays to generate rides",
  },
];

export const WEEKDAYS = [
  { id: 0, label: "Mon", full: "Monday" },
  { id: 1, label: "Tue", full: "Tuesday" },
  { id: 2, label: "Wed", full: "Wednesday" },
  { id: 3, label: "Thu", full: "Thursday" },
  { id: 4, label: "Fri", full: "Friday" },
  { id: 5, label: "Sat", full: "Saturday" },
  { id: 6, label: "Sun", full: "Sunday" },
];

/**
 * Calculates the exact projected dates on which rides will be generated.
 */
export const calculateProjectedDates = ({
  recurrence_type,
  start_date,
  end_date,
  selected_weekdays = [],
  working_days = 2,
  off_days = 2,
  shift_start_date = null,
}) => {
  if (recurrence_type === "ONCE") {
    return start_date ? [start_date] : [];
  }

  if (!start_date || !end_date) return [];

  const start = new Date(start_date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(end_date);
  end.setHours(0, 0, 0, 0);

  if (start > end) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = [];
  const current = new Date(start);

  const shiftAnchor = shift_start_date ? new Date(shift_start_date) : new Date(start);
  shiftAnchor.setHours(0, 0, 0, 0);

  const wDays = Number(working_days) > 0 ? Number(working_days) : 1;
  const oDays = Number(off_days) > 0 ? Number(off_days) : 1;
  const shiftCycle = wDays + oDays;

  // Set of selected weekday indices (0=Mon, 6=Sun)
  const customSet = new Set(selected_weekdays);

  while (current <= end) {
    // Exclude past dates
    if (current >= today) {
      // JS getDay(): 0=Sunday, 1=Monday... 6=Saturday
      // Convert to 0=Monday ... 6=Sunday
      const jsDay = current.getDay();
      const monBasedDay = jsDay === 0 ? 6 : jsDay - 1;

      if (recurrence_type === "DAILY") {
        dates.push(new Date(current));
      } else if (recurrence_type === "WEEKDAYS") {
        if (monBasedDay < 5) {
          dates.push(new Date(current));
        }
      } else if (recurrence_type === "SHIFT") {
        const diffMs = current.getTime() - shiftAnchor.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        const cyclePos = ((diffDays % shiftCycle) + shiftCycle) % shiftCycle;
        if (cyclePos < wDays) {
          dates.push(new Date(current));
        }
      } else if (recurrence_type === "CUSTOM") {
        if (customSet.has(monBasedDay)) {
          dates.push(new Date(current));
        }
      }
    }

    current.setDate(current.getDate() + 1);
  }

  return dates;
};

export const formatRecurrenceLabel = (type, selectedWeekdays = [], workingDays = 2, offDays = 2) => {
  switch (type) {
    case "ONCE":
      return "One-Time Ride";
    case "DAILY":
      return "Every Day";
    case "WEEKDAYS":
      return "Monday to Friday";
    case "SHIFT":
      return `Shift (${workingDays} Work / ${offDays} Off)`;
    case "CUSTOM": {
      if (!selectedWeekdays || selectedWeekdays.length === 0) return "Custom";
      const names = selectedWeekdays
        .map((id) => WEEKDAYS.find((w) => w.id === id)?.label)
        .filter(Boolean);
      return `Custom (${names.join(", ")})`;
    }
    default:
      return type || "One-Time";
  }
};
