// src/utils/validators.ts

const WHITELIST = [
  "echo", "date", "whoami", "uptime", "ls", "cat", "hostname"
];

const FORBIDDEN = [
  "|", "&&", ";", "$(", "`", ">", "<", "rm ", "sudo", "shutdown", "reboot"
];

/**
 * Validates a command string based on the backend's whitelist/blacklist.
 * @param command The command to validate.
 * @returns A promise that rejects with an error message if invalid.
 */
export const validateCommand = (_: any, value: string) => {
  if (!value || value.trim().length === 0) {
    return Promise.reject(new Error("Command cannot be empty."));
  }

  const lower = value.toLowerCase();

  for (const f of FORBIDDEN) {
    if (lower.includes(f)) {
      return Promise.reject(new Error(`Command contains forbidden operator: ${f}`));
    }
  }

  let firstToken = value.trim().split(/\s+/)[0];
  if (firstToken.includes("/")) {
    firstToken = firstToken.substring(firstToken.lastIndexOf('/') + 1);
  }

  if (!WHITELIST.includes(firstToken)) {
    return Promise.reject(new Error(
      `Command '${firstToken}' is not in the whitelist. Allowed: ${WHITELIST.join(', ')}`
    ));
  }

  return Promise.resolve();
};