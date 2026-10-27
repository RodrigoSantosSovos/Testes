export function greet(name) {
  if (!name || typeof name !== "string") {
    throw new Error("name is required");
  }
  return `Hello, ${name}!`;
}
