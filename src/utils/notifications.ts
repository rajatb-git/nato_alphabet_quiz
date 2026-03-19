let Notifications: any = null;

async function getNotifications(): Promise<any> {
  if (!Notifications) {
    try {
      Notifications = await import('expo-notifications');
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch {
      return null;
    }
  }
  return Notifications;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const N = await getNotifications();
  if (!N) return false;
  try {
    const { status: existing } = await N.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await N.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleDailyReminder(hour = 19, minute = 0): Promise<void> {
  const N = await getNotifications();
  if (!N) return;
  try {
    await N.cancelAllScheduledNotificationsAsync();
    await N.scheduleNotificationAsync({
      content: {
        title: 'Alpha Bravo Quiz Reminder',
        body: "Don't break your streak! Take a quick quiz today.",
      },
      trigger: {
        type: N.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  } catch {
    // Notifications not available (Expo Go)
  }
}

export async function cancelReminders(): Promise<void> {
  const N = await getNotifications();
  if (!N) return;
  try {
    await N.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
}
