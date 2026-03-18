type LogData = Record<string, unknown>;

/**
 * Lightweight structured logger for server actions.
 * Outputs consistent `[scope] event` lines with optional data and duration tracking.
 *
 * Usage:
 *   const log = logger('createBooking');
 *   log.info('start', { stayId });
 *   log.error('validation failed', { field: 'dates' });
 *   log.info('ok', { duration: log.elapsed() });
 */
export function logger(scope: string) {
  const start = performance.now();

  function elapsed() {
    return Math.round(performance.now() - start) + 'ms';
  }

  function format(event: string, data?: LogData) {
    return data
      ? `[${scope}] ${event} ${JSON.stringify(data)}`
      : `[${scope}] ${event}`;
  }

  return {
    elapsed,
    info(event: string, data?: LogData) {
      console.log(format(event, data));
    },
    warn(event: string, data?: LogData) {
      console.warn(format(event, data));
    },
    error(event: string, data?: LogData) {
      console.error(format(event, data));
    },
  };
}
