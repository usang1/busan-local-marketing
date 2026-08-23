import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**", "next-env.d.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        React: "readonly",
        JSX: "readonly",
        Request: "readonly",
        Response: "readonly",
        fetch: "readonly",
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        URL: "readonly",
        Date: "readonly",
        Boolean: "readonly",
        Number: "readonly",
        Array: "readonly",
        Object: "readonly",
        String: "readonly",
        Error: "readonly",
        RegExp: "readonly",
        Promise: "readonly",
        Math: "readonly",
        encodeURIComponent: "readonly",
        decodeURIComponent: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        CustomEvent: "readonly",
        MouseEvent: "readonly",
        HTMLElement: "readonly",
        HTMLScriptElement: "readonly",
        FormData: "readonly",
        File: "readonly",
        crypto: "readonly",
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
);
