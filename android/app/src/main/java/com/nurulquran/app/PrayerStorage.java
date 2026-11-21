package com.nurulquran.app;

import android.content.Context;
import android.content.SharedPreferences;
import org.json.JSONArray;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

public final class PrayerStorage {
    private static final String PREFS_NAME = "nq_widget_alerts";
    private static final String KEY_PAYLOAD = "payload_json";

    private PrayerStorage() {}

    public static void savePayload(Context context, String jsonPayload) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit().putString(KEY_PAYLOAD, jsonPayload).apply();
    }

    public static JSONObject loadPayload(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String raw = prefs.getString(KEY_PAYLOAD, null);
        if (raw == null || raw.isEmpty()) {
            return null;
        }
        try {
            return new JSONObject(raw);
        } catch (Exception e) {
            return null;
        }
    }

    public static JSONObject getDaySchedule(JSONObject payload, Calendar cal) {
        if (payload == null) return null;
        JSONArray days = payload.optJSONArray("days");
        if (days == null || days.length() == 0) return null;

        SimpleDateFormat fmt = new SimpleDateFormat("yyyy-MM-dd", Locale.US);
        String targetDate = fmt.format(cal.getTime());
        for (int i = 0; i < days.length(); i++) {
            JSONObject day = days.optJSONObject(i);
            if (day != null && targetDate.equals(day.optString("date"))) {
                return day;
            }
        }
        return days.optJSONObject(0);
    }

    public static int parseTimeToMinutes(String hhmm) {
        if (hhmm == null || !hhmm.contains(":")) return -1;
        try {
            String[] parts = hhmm.split(":");
            int h = Integer.parseInt(parts[0].trim());
            int m = Integer.parseInt(parts[1].trim());
            return h * 60 + m;
        } catch (Exception e) {
            return -1;
        }
    }
}
