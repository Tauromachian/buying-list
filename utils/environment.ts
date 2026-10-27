export function assertEnvVar(
  envVar?: string,
  name?: string,
): asserts envVar is string {
  if (!envVar) {
    throw new Error(`Environment variable is required ${name && ":" + name}`);
  }
}
