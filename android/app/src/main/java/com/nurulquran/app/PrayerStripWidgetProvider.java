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
 * Single unified 4x1 prayer widget (Option 2 + Version 2 Uniform Lighter Green #187A28):
 * - Uniform fresh green body (#187A28) + #125E1E header bar (zero darkening to the right)
 * - Full weekday and month name ("Shanba, 21 Noyabr")
 * - 6 columns (Bomdod, Quyosh, Peshin, Asr, Shom, Xufton) with position-aware gold active highlight
 */
public class PrayerStripWidgetProvider extends AppWidgetProvider {

    private static final String[][] SHORT_TO_FULL_DATE_TOKENS = {
        {"Yak,", "Yakshanba,"},
        {"Dush,", "Dushanba,"},
        {"Sesh,", "Seshanba,"},
        {"Chor,", "Chorshanba,"},
        {"Pay,", "Payshanba,"},
        {"Jum,", "Juma,"},
        {"Shan,", "Shanba,"},
        {"Якш,", "Якшанба,"},
        {"Душ,", "Душанба,"},
        {"Сеш,", "Сешанба,"},
        {"Чор,", "Чоршанба,"},
        {"Пай,", "Пайшанба,"},
        {"Жум,", "Жума,"},
        {"Шан,", "Шанба,"},
        {" Yan", " Yanvar"},
        {" Fev", " Fevral"},
        {" Mar", " Mart"},
        {" Apr", " Aprel"},
        {" Avg", " Avgust"},
        {" Sen", " Sentabr"},
        {" Okt", " Oktabr"},
        {" Noy", " Noyabr"},
        {" Dek", " Dekabr"},
        {" Янв", " Январ"},
        {" Фев", " Феврал"},
        {" Мар", " Март"},
        {" Апр", " Апрел"},
        {" Авг", " Август"},
        {" Сен", " Сентябр"},
        {" Окт", " Октябр"},
        {" Ноя", " Ноябр"},
        {" Дек", " Декабр"}
    };

    private static String expandFullDateLabel(String raw) {
        if (raw == null || raw.isEmpty()) return "";
        String out = raw;
        for (String[] pair : SHORT_TO_FULL_DATE_TOKENS) {
            if (out.startsWith(pair[0])) {
                out = pair[1] + out.substring(pair[0].length());
            } else if (out.endsWith(pair[0])) {
                out = out.substring(0, out.length() - pair[0].length()) + pair[1];
            }
        }
        return out;
    }

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
        int[] ids = PrayerWidgetHelper.getWidgetIds(mgr, context, PrayerStripWidgetProvider.class);
        if (ids == null) return;
        for (int id : ids) {
            updateSingleWidget(context, mgr, id);
        }
    }

    private static int getActiveDrawableForPrayerIdx(int prayerIdx) {
        if (prayerIdx == 0) {
            return R.drawable.widget_strip_active_left;
        } else if (prayerIdx == 4) {
            return R.drawable.widget_strip_active_right;
        }
        return R.drawable.widget_strip_active_mid;
    }

    private static void updateSingleWidget(Context context, AppWidgetManager mgr, int widgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.prayer_strip_widget);
        PrayerWidgetHelper.attachClickLaunch(context, views, R.id.strip_widget_root);

        JSONObject payload = PrayerStorage.loadPayload(context);
        if (payload != null) {
            String city = payload.optString("city", "Toshkent");
            views.setTextViewText(R.id.strip_city, city);

            JSONObject labels = payload.optJSONObject("labels");
            String fajrName = labels != null ? labels.optString("fajr", "Bomdod") : "Bomdod";
            String sunriseName = labels != null ? labels.optString("sunrise", "Quyosh") : "Quyosh";
            String dhuhrName = labels != null ? labels.optString("dhuhr", "Peshin") : "Peshin";
            String asrName = labels != null ? labels.optString("asr", "Asr") : "Asr";
            String maghribName = labels != null ? labels.optString("maghrib", "Shom") : "Shom";
            String ishaName = labels != null ? labels.optString("isha", "Xufton") : "Xufton";

            views.setTextViewText(R.id.strip_label_fajr, fajrName);
            views.setTextViewText(R.id.strip_label_sunrise, sunriseName);
            views.setTextViewText(R.id.strip_label_dhuhr, dhuhrName);
            views.setTextViewText(R.id.strip_label_asr, asrName);
            views.setTextViewText(R.id.strip_label_maghrib, maghribName);
            views.setTextViewText(R.id.strip_label_isha, ishaName);

            Calendar now = Calendar.getInstance();
            JSONObject today = PrayerStorage.getDaySchedule(payload, now);
            if (today != null) {
                String gregorian = expandFullDateLabel(today.optString("gregorian", ""));
                String hijri = today.optString("hijri", "");
                views.setTextViewText(R.id.strip_date, !gregorian.isEmpty() ? gregorian : hijri);
                views.setTextColor(R.id.strip_date, Color.parseColor("#E2F8D5"));

                String sunriseTime = today.optString("sunrise", "--:--");
                views.setTextViewText(R.id.strip_time_sunrise, sunriseTime);
                views.setInt(R.id.strip_cell_sunrise, "setBackgroundResource", R.drawable.widget_cell_default);
                views.setTextColor(R.id.strip_label_sunrise, Color.parseColor("#DCEFE0"));
                views.setTextColor(R.id.strip_time_sunrise, Color.WHITE);

                String[] times = {
                    today.optString("fajr", "--:--"),
                    today.optString("dhuhr", "--:--"),
                    today.optString("asr", "--:--"),
                    today.optString("maghrib", "--:--"),
                    today.optString("isha", "--:--")
                };

                int[] cellIds = {
                    R.id.strip_cell_fajr,
                    R.id.strip_cell_dhuhr,
                    R.id.strip_cell_asr,
                    R.id.strip_cell_maghrib,
                    R.id.strip_cell_isha
                };
                int[] labelIds = {
                    R.id.strip_label_fajr,
                    R.id.strip_label_dhuhr,
                    R.id.strip_label_asr,
                    R.id.strip_label_maghrib,
                    R.id.strip_label_isha
                };
                int[] timeIds = {
                    R.id.strip_time_fajr,
                    R.id.strip_time_dhuhr,
                    R.id.strip_time_asr,
                    R.id.strip_time_maghrib,
                    R.id.strip_time_isha
                };

                int nowMinutes = PrayerWidgetHelper.getNowMinutes(now);
                int activeIdx = PrayerWidgetHelper.computeActivePrayerIdx(times, nowMinutes);

                for (int i = 0; i < cellIds.length; i++) {
                    views.setTextViewText(timeIds[i], times[i]);
                    boolean isCurrent = (i == activeIdx);
                    views.setInt(
                        cellIds[i],
                        "setBackgroundResource",
                        isCurrent ? getActiveDrawableForPrayerIdx(i) : R.drawable.widget_cell_default
                    );
                    views.setTextColor(
                        labelIds[i],
                        isCurrent ? Color.parseColor("#FDE68A") : Color.parseColor("#E2F8D5")
                    );
                    views.setTextColor(
                        timeIds[i],
                        Color.WHITE
                    );
                }
            }
        }

        mgr.updateAppWidget(widgetId, views);
    }
}
