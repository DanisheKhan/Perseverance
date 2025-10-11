/**
 * Backup Service
 * Handles automatic backups, cloud sync, and data restoration
 */

// Backup configuration
const BACKUP_CONFIG = {
  AUTO_BACKUP_DAYS: 7, // Auto backup every 7 days
  MAX_LOCAL_BACKUPS: 5, // Keep last 5 backups
  REMINDER_SNOOZE_DAYS: 3, // Snooze reminder for 3 days
};

/**
 * Check if backup reminder should be shown
 */
export const shouldShowBackupReminder = () => {
  const lastBackup = localStorage.getItem("last_backup_date");
  const reminderSnooze = localStorage.getItem("backup_reminder_snooze");

  // If reminder was snoozed, check if snooze period has passed
  if (reminderSnooze) {
    const snoozeDate = new Date(reminderSnooze);
    const now = new Date();
    const daysSinceSnooze = Math.floor(
      (now - snoozeDate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceSnooze < BACKUP_CONFIG.REMINDER_SNOOZE_DAYS) {
      return false; // Still in snooze period
    }
  }

  if (!lastBackup) {
    return true; // Never backed up
  }

  const lastBackupDate = new Date(lastBackup);
  const now = new Date();
  const daysSinceBackup = Math.floor(
    (now - lastBackupDate) / (1000 * 60 * 60 * 24)
  );

  return daysSinceBackup >= BACKUP_CONFIG.AUTO_BACKUP_DAYS;
};

/**
 * Snooze backup reminder
 */
export const snoozeBackupReminder = () => {
  localStorage.setItem("backup_reminder_snooze", new Date().toISOString());
};

/**
 * Clear backup reminder snooze
 */
export const clearBackupSnooze = () => {
  localStorage.removeItem("backup_reminder_snooze");
};

/**
 * Export all data as JSON
 */
export const exportBackup = () => {
  try {
    const data = {
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      data: {
        habits: JSON.parse(localStorage.getItem("habits") || "[]"),
        completions: JSON.parse(localStorage.getItem("completions") || "[]"),
        settings: JSON.parse(localStorage.getItem("settings") || "{}"),
        journal: JSON.parse(localStorage.getItem("journal_entries") || "[]"),
        rewards: JSON.parse(localStorage.getItem("rewards_progress") || "{}"),
      },
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `perseverance-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Update last backup date
    localStorage.setItem("last_backup_date", new Date().toISOString());
    clearBackupSnooze();

    // Save to local backup history
    saveToBackupHistory(data);

    return { success: true, filename: link.download };
  } catch (error) {
    console.error("Backup export failed:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Save backup to local history (last 5 backups)
 */
const saveToBackupHistory = (data) => {
  try {
    const history = JSON.parse(localStorage.getItem("backup_history") || "[]");

    // Add new backup
    history.unshift({
      timestamp: data.timestamp,
      size: JSON.stringify(data).length,
      version: data.version,
    });

    // Keep only last N backups
    const trimmed = history.slice(0, BACKUP_CONFIG.MAX_LOCAL_BACKUPS);

    localStorage.setItem("backup_history", JSON.stringify(trimmed));
  } catch (error) {
    console.error("Failed to save backup history:", error);
  }
};

/**
 * Get backup history
 */
export const getBackupHistory = () => {
  try {
    return JSON.parse(localStorage.getItem("backup_history") || "[]");
  } catch {
    return [];
  }
};

/**
 * Import backup from JSON file
 */
export const importBackup = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        // Validate backup structure
        if (!backup.version || !backup.data) {
          throw new Error("Invalid backup file format");
        }

        // Restore data
        if (backup.data.habits) {
          localStorage.setItem("habits", JSON.stringify(backup.data.habits));
        }
        if (backup.data.completions) {
          localStorage.setItem(
            "completions",
            JSON.stringify(backup.data.completions)
          );
        }
        if (backup.data.settings) {
          localStorage.setItem(
            "settings",
            JSON.stringify(backup.data.settings)
          );
        }
        if (backup.data.journal) {
          localStorage.setItem(
            "journal_entries",
            JSON.stringify(backup.data.journal)
          );
        }
        if (backup.data.rewards) {
          localStorage.setItem(
            "rewards_progress",
            JSON.stringify(backup.data.rewards)
          );
        }

        localStorage.setItem("last_backup_date", backup.timestamp);

        resolve({
          success: true,
          timestamp: backup.timestamp,
          version: backup.version,
        });
      } catch (error) {
        reject({ success: false, error: error.message });
      }
    };

    reader.onerror = () => {
      reject({ success: false, error: "Failed to read file" });
    };

    reader.readAsText(file);
  });
};

/**
 * Calculate backup size
 */
export const calculateBackupSize = () => {
  try {
    const data = {
      habits: localStorage.getItem("habits") || "[]",
      completions: localStorage.getItem("completions") || "[]",
      settings: localStorage.getItem("settings") || "{}",
      journal: localStorage.getItem("journal_entries") || "[]",
      rewards: localStorage.getItem("rewards_progress") || "{}",
    };

    const totalSize = Object.values(data).reduce(
      (sum, item) => sum + item.length,
      0
    );
    return totalSize;
  } catch {
    return 0;
  }
};

/**
 * Auto backup check on app load
 */
export const checkAutoBackup = () => {
  const lastBackup = localStorage.getItem("last_backup_date");

  if (!lastBackup) {
    return { shouldBackup: true, reason: "No backup found" };
  }

  const lastBackupDate = new Date(lastBackup);
  const now = new Date();
  const daysSinceBackup = Math.floor(
    (now - lastBackupDate) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceBackup >= BACKUP_CONFIG.AUTO_BACKUP_DAYS) {
    return {
      shouldBackup: true,
      reason: `Last backup was ${daysSinceBackup} days ago`,
      daysSinceBackup,
    };
  }

  return { shouldBackup: false, daysSinceBackup };
};

/**
 * Cloud Backup Integration (Google Drive)
 * Note: Requires Google Drive API setup and OAuth2 authentication
 * This is a placeholder for future cloud sync feature
 */

export const cloudBackupConfig = {
  enabled: false, // Set to true after OAuth setup
  provider: "google-drive", // 'google-drive' | 'dropbox' | 'onedrive'
  autoSync: false,
};

/**
 * Initialize cloud backup (requires OAuth)
 */
export const initCloudBackup = async () => {
  // Placeholder for Google Drive API initialization
  // Requires:
  // 1. Google Cloud Console project
  // 2. OAuth2 credentials
  // 3. Drive API enabled
  // 4. User authentication flow

  console.log(
    "Cloud backup not configured. See DEPLOYMENT.md for setup instructions."
  );
  return { success: false, message: "Cloud backup requires configuration" };
};

/**
 * Upload backup to cloud
 */
export const uploadToCloud = async (data) => {
  if (!cloudBackupConfig.enabled) {
    return { success: false, message: "Cloud backup not enabled" };
  }

  // Placeholder for cloud upload logic
  // Would use Google Drive API, Dropbox API, etc.
  console.log("Cloud upload not implemented");
  return { success: false, message: "Cloud upload not implemented" };
};

/**
 * Download backup from cloud
 */
export const downloadFromCloud = async () => {
  if (!cloudBackupConfig.enabled) {
    return { success: false, message: "Cloud backup not enabled" };
  }

  // Placeholder for cloud download logic
  console.log("Cloud download not implemented");
  return { success: false, message: "Cloud download not implemented" };
};

/**
 * List cloud backups
 */
export const listCloudBackups = async () => {
  if (!cloudBackupConfig.enabled) {
    return [];
  }

  // Placeholder for listing cloud backups
  return [];
};
