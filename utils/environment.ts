export function assertEnvVar(
  name: string,
  envVar?: string,
): asserts envVar is string {
  if (!envVar) {
    throw new Error(`Environment variable ${name} is required`);
  }
}
