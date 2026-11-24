package com.nurulquran.app;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import org.json.JSONArray;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public final class PrayerAlarmScheduler {
    public static final String ACTION_PRAYER_ALERT = "app.nurul.islam.ACTION_PRAYER_ALERT";
    public static final String ACTION_WIDGET_TICK = "app.nurul.islam.ACTION_WIDGET_TICK";

    private static final String[] ALERT_KEYS = {"fajr", "dhuhr", "asr", "maghrib", "isha"};
    private static final String[] WIDGET_KEYS = {"imsak", "fajr", "dhuhr", "asr", "maghrib", "isha"};
    private static final int MAX_ALARM_SLOTS = 96;
    private static final int MAX_TICK_SLOTS = 24;
    private static final int BASE_TICK_REQUEST_CODE = 42000;

    private PrayerAlarmScheduler() {}

    public static void rescheduleAll(Context context) {
        AlarmManager am = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;

        // Clear previously scheduled slots cleanly
        for (int req = 0; req < MAX_ALARM_SLOTS; req++) {
            PendingIntent pi = buildAlertPendingIntent(context, req, null, null, null, 0, PendingIntent.FLAG_NO_CREATE);
            if (pi != null) {
                am.cancel(pi);
                pi.cancel();
            }
        }
        for (int req = 0; req < 16; req++) {
            PendingIntent tickPi = buildTickPendingIntent(context, BASE_TICK_REQUEST_CODE + req, PendingIntent.FLAG_NO_CREATE);
            if (tickPi != null) {
                am.cancel(tickPi);
                tickPi.cancel();
            }
        }

        JSONObject payload = PrayerStorage.loadPayload(context);
        if (payload == null) return;

        JSONArray days = payload.optJSONArray("days");
        if (days == null || days.length() == 0) return;

        JSONObject alerts = payload.optJSONObject("alerts");
        JSONObject labels = payload.optJSONObject("labels");
        String city = payload.optString("city", "Nurul Islam");
        boolean enabled = alerts != null && alerts.optBoolean("enabled", false);

        long nowMs = System.currentTimeMillis();
        SimpleDateFormat isoFmt = new SimpleDateFormat("yyyy-MM-dd", Locale.US);

        int alarmSlot = 0;
        int tickSlot = 0;

        for (int d = 0; d < days.length(); d++) {
            JSONObject dayObj = days.optJSONObject(d);
            if (dayObj == null) continue;

            String dateStr = dayObj.optString("date", "");
            Date parsedDate;
            try {
                parsedDate = isoFmt.parse(dateStr);
            } catch (Exception e) {
                continue;
            }
            if (parsedDate == null) continue;

            // Schedule lightweight widget UI transition ticks at today's & upcoming prayer/imsak times
            if (tickSlot < MAX_TICK_SLOTS) {
                for (String key : WIDGET_KEYS) {
                    if (tickSlot >= MAX_TICK_SLOTS) break;
                    long triggerMs = computeTriggerMillis(parsedDate, dayObj.optString(key, ""));
                    if (triggerMs > nowMs + 5000L) {
                        PendingIntent tickPi = buildTickPendingIntent(context, BASE_TICK_REQUEST_CODE + tickSlot, PendingIntent.FLAG_UPDATE_CURRENT);
                        scheduleTrigger(am, triggerMs + 2000L, tickPi);
                        tickSlot++;
                    }
                }
            }

            if (!enabled) continue;

            for (String key : ALERT_KEYS) {
                if (alarmSlot >= MAX_ALARM_SLOTS) break;

                String timeStr = dayObj.optString(key, "");
                long prayerMs = computeTriggerMillis(parsedDate, timeStr);
                if (prayerMs <= 0) continue;

                String prayerLabel = labels != null ? labels.optString(key, key) : key;

                // Exact prayer time alert only (no pre-prayer reminders)
                if (prayerMs > nowMs + 2000L && alarmSlot < MAX_ALARM_SLOTS) {
                    PendingIntent pi = buildAlertPendingIntent(
                        context, alarmSlot++, prayerLabel, timeStr, city, 0, PendingIntent.FLAG_UPDATE_CURRENT
                    );
                    scheduleTrigger(am, prayerMs, pi);
                }
            }
        }
    }

    private static long computeTriggerMillis(Date date, String hhmm) {
        int mins = PrayerStorage.parseTimeToMinutes(hhmm);
        if (mins < 0) return -1L;
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, mins / 60);
        cal.set(Calendar.MINUTE, mins % 60);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTimeInMillis();
    }

    private static void scheduleTrigger(AlarmManager am, long triggerMs, PendingIntent pi) {
        if (pi == null) return;
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                if (am.canScheduleExactAlarms()) {
                    am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerMs, pi);
                } else {
                    am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerMs, pi);
                }
            } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerMs, pi);
            } else {
                am.setExact(AlarmManager.RTC_WAKEUP, triggerMs, pi);
            }
        } catch (SecurityException se) {
            am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerMs, pi);
        }
    }

    private static PendingIntent buildAlertPendingIntent(
        Context context,
        int requestCode,
        String prayerName,
        String timeStr,
        String city,
        int reminderMins,
        int baseFlags
    ) {
        Intent intent = new Intent(context, PrayerAlarmReceiver.class);
        intent.setAction(ACTION_PRAYER_ALERT);
        if (prayerName != null) intent.putExtra("prayerName", prayerName);
        if (timeStr != null) intent.putExtra("timeStr", timeStr);
        if (city != null) intent.putExtra("city", city);
        intent.putExtra("reminderMins", reminderMins);
        int flags = baseFlags | PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getBroadcast(context, 1000 + requestCode, intent, flags);
    }

    private static PendingIntent buildTickPendingIntent(Context context, int requestCode, int baseFlags) {
        Intent intent = new Intent(context, PrayerStripWidgetProvider.class);
        intent.setAction(ACTION_WIDGET_TICK);
        int flags = baseFlags | PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getBroadcast(context, requestCode, intent, flags);
    }
}
