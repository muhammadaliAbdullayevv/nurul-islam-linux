package com.nurulquran.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;
import org.json.JSONObject;

public class PrayerAlarmReceiver extends BroadcastReceiver {
    public static final String CHANNEL_ID = "nq_prayer_alerts_v1";

    @Override
    public void onReceive(Context context, Intent intent) {
        String prayerName = intent.getStringExtra("prayerName");
        String timeStr = intent.getStringExtra("timeStr");
        String city = intent.getStringExtra("city");
        int reminderMins = intent.getIntExtra("reminderMins", 0);

        if (prayerName == null) prayerName = "Namoz";
        if (timeStr == null) timeStr = "";
        if (city == null) city = "Nurul Islam";

        showPrayerNotification(context, prayerName, timeStr, city, reminderMins);
        PrayerWidgetProvider.updateAllWidgets(context);
        PrayerAlarmScheduler.rescheduleAll(context);
    }

    public static void showPrayerNotification(
        Context context,
        String prayerName,
        String timeStr,
        String city,
        int reminderMins
    ) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(context, android.Manifest.permission.POST_NOTIFICATIONS)
                != PackageManager.PERMISSION_GRANTED) {
                return;
            }
        }

        ensureChannel(context);

        JSONObject payload = PrayerStorage.loadPayload(context);
        JSONObject labels = payload != null ? payload.optJSONObject("labels") : null;

        String title;
        if (reminderMins > 0) {
            String tpl = labels != null
                ? labels.optString("reminderTitleTemplate", "{prayer} ({mins}m)")
                : "{prayer} ({mins}m)";
            title = tpl.replace("{prayer}", prayerName).replace("{mins}", String.valueOf(reminderMins));
        } else {
            String tpl = labels != null
                ? labels.optString("alertTitleTemplate", "{prayer}")
                : "{prayer}";
            title = tpl.replace("{prayer}", prayerName);
        }

        String bodyTpl = labels != null
            ? labels.optString("alertBodyTemplate", "{city} · {time}")
            : "{city} · {time}";
        String body = bodyTpl.replace("{city}", city).replace("{time}", timeStr);

        Intent launchIntent = new Intent(context, MainActivity.class);
        launchIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent contentIntent = PendingIntent.getActivity(
            context,
            2001,
            launchIntent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setAutoCancel(true)
            .setContentIntent(contentIntent);

        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) {
            int notifId = (prayerName + timeStr + reminderMins).hashCode();
            nm.notify(notifId, builder.build());
        }
    }

    public static void ensureChannel(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;

        NotificationChannel existing = nm.getNotificationChannel(CHANNEL_ID);
        if (existing != null) return;

        Uri soundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        AudioAttributes attrs = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_NOTIFICATION)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build();

        NotificationChannel channel = new NotificationChannel(
            CHANNEL_ID,
            "Prayer Times & Reminders",
            NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("Daily prayer time alerts and pre-prayer reminders");
        channel.enableVibration(true);
        channel.setSound(soundUri, attrs);
        nm.createNotificationChannel(channel);
    }
}
