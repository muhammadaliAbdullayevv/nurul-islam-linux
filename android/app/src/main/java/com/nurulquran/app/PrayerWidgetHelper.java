package com.nurulquran.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.widget.RemoteViews;
import java.util.Calendar;

final class PrayerWidgetHelper {
    private PrayerWidgetHelper() {}

    static PendingIntent createOpenAppIntent(Context context) {
        Intent openIntent = new Intent(context, MainActivity.class);
        openIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int piFlags = PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getActivity(context, 0, openIntent, piFlags);
    }

    static int getNowMinutes(Calendar cal) {
        return cal.get(Calendar.HOUR_OF_DAY) * 60 + cal.get(Calendar.MINUTE);
    }

    /** Returns the index [0..4] of the currently active prayer window (defaults to 4 / Isha before Fajr). */
    static int computeActivePrayerIdx(String[] times, int nowMinutes) {
        int activeIdx = 4;
        for (int i = 0; i < times.length; i++) {
            int mins = PrayerStorage.parseTimeToMinutes(times[i]);
            if (mins >= 0 && nowMinutes >= mins) {
                activeIdx = i;
            }
        }
        return activeIdx;
    }

    /** Returns the index [0..4] of the next upcoming prayer today, or 0 (Fajr) after Isha. */
    static int computeNextPrayerIdx(String[] times, int nowMinutes) {
        for (int i = 0; i < times.length; i++) {
            int mins = PrayerStorage.parseTimeToMinutes(times[i]);
            if (mins > nowMinutes) {
                return i;
            }
        }
        return 0;
    }

    static void attachClickLaunch(Context context, RemoteViews views, int rootViewId) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.CUPCAKE) {
            views.setOnClickPendingIntent(rootViewId, createOpenAppIntent(context));
        }
    }

    static int[] getWidgetIds(AppWidgetManager mgr, Context context, Class<?> providerClass) {
        return mgr.getAppWidgetIds(new ComponentName(context, providerClass));
    }
}
