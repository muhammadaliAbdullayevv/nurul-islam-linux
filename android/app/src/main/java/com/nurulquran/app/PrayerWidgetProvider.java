package com.nurulquran.app;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.widget.RemoteViews;
import org.json.JSONObject;
import java.util.Calendar;

public class PrayerWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int widgetId : appWidgetIds) {
            updateSingleWidget(context, appWidgetManager, widgetId);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        String action = intent != null ? intent.getAction() : null;
        if (PrayerAlarmScheduler.ACTION_WIDGET_TICK.equals(action)
            || Intent.ACTION_TIME_CHANGED.equals(action)
            || Intent.ACTION_DATE_CHANGED.equals(action)) {
            updateAllWidgets(context);
        }
    }

    public static void updateAllWidgets(Context context) {
        AppWidgetManager mgr = AppWidgetManager.getInstance(context);
        if (mgr == null) return;
        PrayerStripWidgetProvider.updateWidgets(context, mgr);
    }

    private static void updateSingleWidget(Context context, AppWidgetManager mgr, int widgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.prayer_widget);
        PrayerWidgetHelper.attachClickLaunch(context, views, R.id.widget_root);

        JSONObject payload = PrayerStorage.loadPayload(context);
        if (payload != null) {
            String city = payload.optString("city", "Tashkent");
            views.setTextViewText(R.id.widget_city, city);

            JSONObject labels = payload.optJSONObject("labels");
            String fajrName = labels != null ? labels.optString("fajr", "Bomdod") : "Bomdod";
            String dhuhrName = labels != null ? labels.optString("dhuhr", "Peshin") : "Peshin";
            String asrName = labels != null ? labels.optString("asr", "Asr") : "Asr";
            String maghribName = labels != null ? labels.optString("maghrib", "Shom") : "Shom";
            String ishaName = labels != null ? labels.optString("isha", "Xufton") : "Xufton";
            String sunriseLabel = labels != null ? labels.optString("sunrise", "Quyosh") : "Quyosh";
            String suhoorLabel = labels != null ? labels.optString("suhoorLabel", "Saharlik") : "Saharlik";
            String nowLabel = labels != null ? labels.optString("nowLabel", "Hozir") : "Hozir";
            String nextPrefix = labels != null ? labels.optString("nextLabel", "Keyingi") : "Keyingi";

            views.setTextViewText(R.id.label_fajr, fajrName);
            views.setTextViewText(R.id.label_dhuhr, dhuhrName);
            views.setTextViewText(R.id.label_asr, asrName);
            views.setTextViewText(R.id.label_maghrib, maghribName);
            views.setTextViewText(R.id.label_isha, ishaName);
            views.setTextViewText(R.id.widget_sunrise_label, sunriseLabel);
            views.setTextViewText(R.id.widget_suhoor_label, suhoorLabel);
            views.setTextViewText(R.id.widget_now_label, nowLabel);

            Calendar now = Calendar.getInstance();
            JSONObject today = PrayerStorage.getDaySchedule(payload, now);
            if (today != null) {
                String gregorian = today.optString("gregorian", "");
                String hijri = today.optString("hijri", "");
                String dateLine = !gregorian.isEmpty() && !hijri.isEmpty()
                    ? gregorian + " · " + hijri
                    : (!hijri.isEmpty() ? hijri : gregorian);
                views.setTextViewText(R.id.widget_hijri, dateLine);

                String fajr = today.optString("fajr", "--:--");
                String sunrise = today.optString("sunrise", "--:--");
                String imsak = today.optString("imsak", "--:--");
                String dhuhr = today.optString("dhuhr", "--:--");
                String asr = today.optString("asr", "--:--");
                String maghrib = today.optString("maghrib", "--:--");
                String isha = today.optString("isha", "--:--");

                views.setTextViewText(R.id.widget_suhoor_time, imsak);
                views.setTextViewText(R.id.widget_sunrise_time, sunrise);
                views.setTextViewText(R.id.time_fajr, fajr);
                views.setTextViewText(R.id.time_dhuhr, dhuhr);
                views.setTextViewText(R.id.time_asr, asr);
                views.setTextViewText(R.id.time_maghrib, maghrib);
                views.setTextViewText(R.id.time_isha, isha);

                String[] times = {fajr, dhuhr, asr, maghrib, isha};
                String[] names = {fajrName, dhuhrName, asrName, maghribName, ishaName};
                int[] cellIds = {
                    R.id.cell_fajr, R.id.cell_dhuhr, R.id.cell_asr, R.id.cell_maghrib, R.id.cell_isha
                };
                int[] labelIds = {
                    R.id.label_fajr, R.id.label_dhuhr, R.id.label_asr, R.id.label_maghrib, R.id.label_isha
                };
                int[] timeIds = {
                    R.id.time_fajr, R.id.time_dhuhr, R.id.time_asr, R.id.time_maghrib, R.id.time_isha
                };

                int nowMinutes = PrayerWidgetHelper.getNowMinutes(now);
                int activeIdx = PrayerWidgetHelper.computeActivePrayerIdx(times, nowMinutes);
                int nextIdx = PrayerWidgetHelper.computeNextPrayerIdx(times, nowMinutes);

                views.setTextViewText(R.id.widget_now_prayer, names[activeIdx]);
                views.setTextViewText(R.id.widget_next_label, nextPrefix + " · " + names[nextIdx]);
                views.setTextViewText(R.id.widget_next_time, times[nextIdx]);

                for (int i = 0; i < cellIds.length; i++) {
                    if (i == activeIdx) {
                        views.setInt(cellIds[i], "setBackgroundResource", R.drawable.widget_active_cell);
                        views.setTextColor(labelIds[i], Color.parseColor("#D0F39F"));
                        views.setTextColor(timeIds[i], Color.parseColor("#D0F39F"));
                    } else if (i == nextIdx) {
                        views.setInt(cellIds[i], "setBackgroundResource", R.drawable.widget_next_cell);
                        views.setTextColor(labelIds[i], Color.parseColor("#FDE68A"));
                        views.setTextColor(timeIds[i], Color.parseColor("#FCD34D"));
                    } else {
                        views.setInt(cellIds[i], "setBackgroundResource", R.drawable.widget_cell_default);
                        views.setTextColor(labelIds[i], Color.parseColor("#B3FFFFFF"));
                        views.setTextColor(timeIds[i], Color.WHITE);
                    }
                }
            }
        }

        mgr.updateAppWidget(widgetId, views);
    }
}
