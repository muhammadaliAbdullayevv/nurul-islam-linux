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
    private static final String LEGACY_CHANNEL_ID = "nq_prayer_alerts_v1";
    public static final String CHANNEL_ID_CHIME = "nq_prayer_chime_v2";
    public static final String CHANNEL_ID_DEFAULT = "nq_prayer_default_v2";
    public static final String CHANNEL_ID_SILENT = "nq_prayer_silent_v2";
    public static final String CHANNEL_ID = CHANNEL_ID_CHIME;

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

    private static Uri getChimeSoundUri(Context context) {
        return Uri.parse("android.resource://" + context.getPackageName() + "/" + R.raw.prayer_chime);
    }

    private static String resolveSoundMode(JSONObject payload) {
        JSONObject alerts = payload != null ? payload.optJSONObject("alerts") : null;
        String mode = alerts != null ? alerts.optString("soundMode", "chime") : "chime";
        if ("default".equals(mode) || "silent".equals(mode)) {
            return mode;
        }
        return "chime";
    }

    private static String channelIdForMode(String soundMode) {
        if ("default".equals(soundMode)) return CHANNEL_ID_DEFAULT;
        if ("silent".equals(soundMode)) return CHANNEL_ID_SILENT;
        return CHANNEL_ID_CHIME;
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
        String soundMode = resolveSoundMode(payload);
        String activeChannelId = channelIdForMode(soundMode);

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

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, activeChannelId)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setAutoCancel(true)
            .setContentIntent(contentIntent);

        if ("silent".equals(soundMode)) {
            builder.setSilent(true);
        } else if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            Uri soundUri = "default".equals(soundMode)
                ? RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
                : getChimeSoundUri(context);
            builder.setSound(soundUri);
        }

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

        // Cleanly retire legacy v1 default-sound channel so system settings stay tidy
        if (nm.getNotificationChannel(LEGACY_CHANNEL_ID) != null) {
            nm.deleteNotificationChannel(LEGACY_CHANNEL_ID);
        }

        AudioAttributes attrs = new AudioAttributes.Builder()
            .setUsage(AudioAttributes.USAGE_NOTIFICATION)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
            .build();

        if (nm.getNotificationChannel(CHANNEL_ID_CHIME) == null) {
            NotificationChannel chimeChannel = new NotificationChannel(
                CHANNEL_ID_CHIME,
                "Prayer Times (Nurul Islam Chime)",
                NotificationManager.IMPORTANCE_HIGH
            );
            chimeChannel.setDescription("Prayer time alerts with the soft Nurul Islam signature chime");
            chimeChannel.enableVibration(true);
            chimeChannel.setSound(getChimeSoundUri(context), attrs);
            nm.createNotificationChannel(chimeChannel);
        }

        if (nm.getNotificationChannel(CHANNEL_ID_DEFAULT) == null) {
            NotificationChannel defaultChannel = new NotificationChannel(
                CHANNEL_ID_DEFAULT,
                "Prayer Times (System Sound)",
                NotificationManager.IMPORTANCE_HIGH
            );
            defaultChannel.setDescription("Prayer time alerts using your device default notification tone");
            defaultChannel.enableVibration(true);
            defaultChannel.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION), attrs);
            nm.createNotificationChannel(defaultChannel);
        }

        if (nm.getNotificationChannel(CHANNEL_ID_SILENT) == null) {
            NotificationChannel silentChannel = new NotificationChannel(
                CHANNEL_ID_SILENT,
                "Prayer Times (Silent)",
                NotificationManager.IMPORTANCE_DEFAULT
            );
            silentChannel.setDescription("Silent prayer time notifications without sound");
            silentChannel.enableVibration(true);
            silentChannel.setSound(null, null);
            nm.createNotificationChannel(silentChannel);
        }
    }
}
