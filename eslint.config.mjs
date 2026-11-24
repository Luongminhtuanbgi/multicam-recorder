import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/dist-web/**',
      '**/web-build/**',
      '**/build/**',
      '**/coverage/**',
      '**/.expo/**',
      '**/.cxx/**',
      'app/android/**',
      'app/ios/**',
      'app/metro.config.js',
      'app/plugins/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,mts}'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['app/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  {
    files: ['app/app/**/*.{ts,tsx}', 'app/src/**/*.{ts,tsx}'],
    ignores: ['app/src/theme/colors.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
          message: 'Chỉ khai báo mã màu HEX tập trung trong app/src/theme/colors.ts.',
        },
        {
          selector: 'Literal[value=/^rgba?\\s*\\(/i]',
          message: 'Chỉ khai báo mã màu tập trung trong app/src/theme/colors.ts.',
        },
      ],
    },
  },
  eslintConfigPrettier
);
