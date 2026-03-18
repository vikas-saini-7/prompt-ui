/**
 * Utility functions to transform generated component code for live preview
 * Removes imports and wraps code to ensure it's executable by react-live
 */

/**
 * Transform generated code to be compatible with react-live
 * - Removes import/export statements
 * - Wraps code to ensure it returns JSX
 * - Handles various component patterns
 */
export function transformCodeForPreview(code: string): string {
  if (!code || code.trim().length === 0) {
    return "<h1>Hello World</h1>";
  }

  // First sanitize the code
  let transformedCode = sanitizeCodeForPreview(code);

  if (!transformedCode || transformedCode.length === 0) {
    return "<h1>Hello World</h1>";
  }

  // Remove "use client" and "use server" directives
  transformedCode = transformedCode
    .replace(/["']use client["'];?\n?/g, "")
    .replace(/["']use server["'];?\n?/g, "")
    .trim();

  // Remove import and export statements, but preserve the code logic
  const lines = transformedCode.split("\n");
  const filteredLines = lines.filter((line) => {
    const trimmed = line.trim();
    return (
      !trimmed.startsWith("import ") &&
      !trimmed.startsWith("export ") &&
      trimmed.length > 0
    );
  });
  transformedCode = filteredLines.join("\n").trim();

  if (!transformedCode) {
    return "<h1>Hello World</h1>";
  }

  // Extract component name if present
  const componentNameMatch = code.match(
    /(?:export\s+default\s+)?(?:function\s+)?(\w+)\s*(?:=\s*\(|\s*\(|$)/,
  );
  const componentName = componentNameMatch ? componentNameMatch[1] : null;

  // Detect various component patterns
  const functionDefRegex =
    /^(?:async\s+)?(?:function|\b(\w+)\s*=\s*(?:async\s*)?\()/;
  const arrowFuncRegex =
    /^(?:async\s+)?(?:const\s+)?(\w+)\s*=\s*(?:async\s*)?\(|^(?:const\s+)?(\w+)\s*=\s*(?:async\s*)?\w+\s*=>/;

  const isFunctionDef = functionDefRegex.test(transformedCode.trim());
  const isArrowFunc = arrowFuncRegex.test(transformedCode.trim());
  const isComponentDef = isFunctionDef || isArrowFunc;

  // Pattern 1: Code ends with component reference
  if (componentName && transformedCode.trim().endsWith(componentName)) {
    return transformedCode;
  }

  // Pattern 2: Component definition (function or arrow)
  if (isComponentDef && componentName) {
    if (
      !transformedCode.includes(`<${componentName}`) &&
      !transformedCode.endsWith(componentName)
    ) {
      return transformedCode + `\n\n${componentName}`;
    }
    return transformedCode;
  }

  // Pattern 3: Direct JSX expression starting with <
  if (transformedCode.startsWith("<")) {
    return transformedCode;
  }

  // Pattern 4: Try to extract return statement JSX
  const returnMatch = transformedCode.match(/return\s+([\s\S]*?)(?:;|$)/);
  if (returnMatch && returnMatch[1]) {
    const returnContent = returnMatch[1].trim();
    if (returnContent.startsWith("(")) {
      const jsxMatch = returnContent.match(/\(([\s\S]*)\)(?:\s*;)?$/);
      if (jsxMatch && jsxMatch[1]) {
        return jsxMatch[1].trim();
      }
    }
    if (returnContent.startsWith("<")) {
      return returnContent;
    }
  }

  // Pattern 5: Just return the code as-is and let react-live handle it
  return transformedCode;
}

/**
 * Validate if code can be executed in react-live
 */
export function validateCodeForPreview(code: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!code || code.trim().length === 0) {
    errors.push("Code is empty");
  }

  // Check for unsupported statements
  if (code.includes("import React from")) {
    errors.push("Default React imports are auto-available, remove them");
  }

  // Check for fetch/async operations that might not work
  if (code.includes("fetch(") || code.includes("async ")) {
    errors.push(
      "Async operations may not work in preview. Keep component rendering simple",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Try to extract and fix common JSX syntax issues
 */
export function sanitizeCodeForPreview(code: string): string {
  let sanitized = code;

  // Remove comments first
  sanitized = sanitized.replace(/\/\/.*$/gm, ""); // Remove single-line comments
  sanitized = sanitized.replace(/\/\*[\s\S]*?\*\//g, ""); // Remove multi-line comments

  // Remove "use client" and "use server" directives (again, for safety)
  sanitized = sanitized
    .replace(/["']use client["'];?\n?/g, "")
    .replace(/["']use server["'];?\n?/g, "");

  // Remove TypeScript type annotations from function params and return types
  sanitized = sanitized.replace(/:\s*\w+(?=\s*[,\)])/g, ""); // Remove type annotations from params
  sanitized = sanitized.replace(/(?::\s*{[^}]*})/g, ""); // Remove object type annotations
  sanitized = sanitized.replace(/:\s*(?:React\.)?\w+(?=\s*[;,\)])/g, ""); // Remove return type annotations
  sanitized = sanitized.replace(/<[A-Z]\w*>/g, ""); // Remove generic types like <T>, <Props>

  // Remove trailing semicolons from JSX expressions
  sanitized = sanitized.replace(/^(\s*<[^;]+);$/gm, "$1");

  // Remove standalone type definitions
  sanitized = sanitized.replace(/^type\s+\w+.*?;$/gm, "");
  sanitized = sanitized.replace(/^interface\s+\w+\s*\{[^}]*\}/gm, "");

  // Remove async/await (not supported in preview)
  sanitized = sanitized.replace(/\basync\s+/g, "");

  // Remove const/let/var keywords before simple JSX (keep function definitions though)
  // But preserve: const MyComponent = () => ...
  sanitized = sanitized.replace(
    /^(const|let|var)\s+(?![\w]+\s*=\s*(?:\(\)?|\([\w\s,]*\)\s*=>))\s*/gm,
    "",
  );

  // Clean up extra whitespace
  sanitized = sanitized
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0)
    .join("\n");

  return sanitized.trim();
}
