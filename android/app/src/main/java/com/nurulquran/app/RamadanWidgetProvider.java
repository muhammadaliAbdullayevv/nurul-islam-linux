package com.nurulquran.app;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.widget.RemoteViews;
import org.json.JSONObject;
import java.util.Calendar;

/**
 * 4x2 Ramadan & Fasting widget highlighting Saharlik (Imsak), Iftorlik (Maghrib),
 * current fasting phase, and supporting prayer boundaries.
 */
public class RamadanWidgetProvider extends AppWidgetProvider {

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
            AppWidgetManager mgr = AppWidgetManager.getInstance(context);
            if (mgr != null) {
                updateWidgets(context, mgr);
            }
        }
    }

    static void updateWidgets(Context context, AppWidgetManager mgr) {
        int[] ids = PrayerWidgetHelper.getWidgetIds(mgr, context, RamadanWidgetProvider.class);
        if (ids == null) return;
        for (int id : ids) {
            updateSingleWidget(context, mgr, id);
        }
    }

    private static void updateSingleWidget(Context context, AppWidgetManager mgr, int widgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.ramadan_widget);
        PrayerWidgetHelper.attachClickLaunch(context, views, R.id.ramadan_widget_root);

        JSONObject payload = PrayerStorage.loadPayload(context);
        if (payload != null) {
            String city = payload.optString("city", "Tashkent");
            JSONObject labels = payload.optJSONObject("labels");

            String ramadanTitle = labels != null ? labels.optString("ramadanTitle", "Ramazon · Ro‘za") : "Ramazon · Ro‘za";
            String suhoorLabel = labels != null ? labels.optString("suhoorLabel", "Saharlik") : "Saharlik";
            String iftorLabel = labels != null ? labels.optString("iftorLabel", "Iftorlik") : "Iftorlik";
            String suhoorPhase = labels != null ? labels.optString("suhoorPhase", "Saharlik vaqti") : "Saharlik vaqti";
            String fastingPhase = labels != null ? labels.optString("fastingPhase", "Iftorgacha ro‘za") : "Iftorgacha ro‘za";
            String iftorPhase = labels != null ? labels.optString("iftorPhase", "Iftorlik vaqti") : "Iftorlik vaqti";

            String fajrName = labels != null ? labels.optString("fajr", "Bomdod") : "Bomdod";
            String sunriseName = labels != null ? labels.optString("sunrise", "Quyosh") : "Quyosh";
            String asrName = labels != null ? labels.optString("asr", "Asr") : "Asr";
            String ishaName = labels != null ? labels.optString("isha", "Xufton") : "Xufton";

            views.setTextViewText(R.id.ramadan_title, ramadanTitle);
            views.setTextViewText(R.id.ramadan_suhoor_label, suhoorLabel);
            views.setTextViewText(R.id.ramadan_iftor_label, iftorLabel);
            views.setTextViewText(R.id.ramadan_fajr_label, fajrName);
            views.setTextViewText(R.id.ramadan_sunrise_label, sunriseName);
            views.setTextViewText(R.id.ramadan_asr_label, asrName);
            views.setTextViewText(R.id.ramadan_isha_label, ishaName);

            Calendar now = Calendar.getInstance();
            JSONObject today = PrayerStorage.getDaySchedule(payload, now);
            if (today != null) {
                String hijri = today.optString("hijri", "");
                String subtitle = !hijri.isEmpty() ? city + " · " + hijri : city;
                views.setTextViewText(R.id.ramadan_subtitle, subtitle);

                String imsak = today.optString("imsak", "--:--");
                String fajr = today.optString("fajr", "--:--");
                String sunrise = today.optString("sunrise", "--:--");
                String asr = today.optString("asr", "--:--");
                String maghrib = today.optString("maghrib", "--:--");
                String isha = today.optString("isha", "--:--");

                int nowMin = PrayerWidgetHelper.getNowMinutes(now);
                int imsakMin = PrayerStorage.parseTimeToMinutes(imsak);
                int maghribMin = PrayerStorage.parseTimeToMinutes(maghrib);
                int ishaMin = PrayerStorage.parseTimeToMinutes(isha);

                String displaySuhoor = imsak;
                boolean highlightSuhoor = false;
                String statusBadge = fastingPhase;

                if (imsakMin >= 0 && nowMin <= imsakMin) {
                    statusBadge = suhoorPhase;
                    highlightSuhoor = true;
                } else if (maghribMin >= 0 && nowMin < maghribMin) {
                    statusBadge = fastingPhase;
                    highlightSuhoor = false;
                } else if (ishaMin >= 0 && nowMin >= ishaMin) {
                    // Late night: switch focus toward tomorrow's Suhoor
                    Calendar tomorrowCal = (Calendar) now.clone();
                    tomorrowCal.add(Calendar.DAY_OF_YEAR, 1);
                    JSONObject tomorrow = PrayerStorage.getDaySchedule(payload, tomorrowCal);
                    if (tomorrow != null) {
                        displaySuhoor = tomorrow.optString("imsak", imsak);
                    }
                    statusBadge = suhoorPhase;
                    highlightSuhoor = true;
                } else {
                    statusBadge = iftorPhase;
                    highlightSuhoor = false;
                }

                views.setTextViewText(R.id.ramadan_status_badge, statusBadge);
                views.setTextViewText(R.id.ramadan_suhoor_time, displaySuhoor);
                views.setTextViewText(R.id.ramadan_iftor_time, maghrib);
                views.setTextViewText(R.id.ramadan_fajr_time, fajr);
                views.setTextViewText(R.id.ramadan_sunrise_time, sunrise);
                views.setTextViewText(R.id.ramadan_asr_time, asr);
                views.setTextViewText(R.id.ramadan_isha_time, isha);

                views.setInt(
                    R.id.ramadan_card_suhoor,
                    "setBackgroundResource",
                    highlightSuhoor ? R.drawable.widget_ramadan_card_active : R.drawable.widget_ramadan_card
                );
                views.setTextColor(
                    R.id.ramadan_suhoor_label,
                    highlightSuhoor ? Color.parseColor("#FDE68A") : Color.parseColor("#CBD5E1")
                );
                views.setTextColor(
                    R.id.ramadan_suhoor_time,
                    highlightSuhoor ? Color.parseColor("#FBBF24") : Color.WHITE
                );

                views.setInt(
                    R.id.ramadan_card_iftor,
                    "setBackgroundResource",
                    !highlightSuhoor ? R.drawable.widget_ramadan_card_active : R.drawable.widget_ramadan_card
                );
                views.setTextColor(
                    R.id.ramadan_iftor_label,
                    !highlightSuhoor ? Color.parseColor("#FDE68A") : Color.parseColor("#CBD5E1")
                );
                views.setTextColor(
                    R.id.ramadan_iftor_time,
                    !highlightSuhoor ? Color.parseColor("#FBBF24") : Color.WHITE
                );
            }
        }

        mgr.updateAppWidget(widgetId, views);
    }
}
