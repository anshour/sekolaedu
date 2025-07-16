import UserService from "~/services/user-service";
import logger from "~/utils/logger";

/**
 * Cleanup expired tokens from the blacklist
 * This should be run periodically (e.g., via cron job)
 * TODO: Implement a cron job or scheduled task to call this function periodically
 */
export async function cleanupExpiredTokens(): Promise<void> {
  try {
    await UserService.cleanupExpiredTokens();
    logger.info("Successfully cleaned up expired tokens from blacklist");
  } catch (error) {
    logger.error("Failed to cleanup expired tokens:", error);
  }
}
