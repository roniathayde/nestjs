import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
	// 2. Configuração base do ESLint
	js.configs.recommended,

	// 3. Configuração base do TypeScript
	...tseslint.configs.recommended,

	// 4. Sua configuração principal
	{
		files: ['**/*.{js,mjs,cjs,ts,cts}'],
		languageOptions: {
			globals: globals.node,
		},
		rules: {
			'no-console': ['warn', { allow: ['warn', 'error'] }],
			'no-debugger': 'error',
			'no-var': 'error',
			'prefer-const': 'error',
			'@typescript-eslint/no-unused-vars': 'off'
		},
	},
	// 5. Configuração do plugin do Prettier (Roda o Prettier como regra)
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			// Ativa a regra do Prettier
			'prettier/prettier': 'error',
		},
	},

	// 6. Configuração do "desativador" do Prettier (ESSENCIAL)
	// Deve ser o ÚLTIMO item da array.
	// Desativa regras do js.configs.recommended e tseslint.configs.recommended
	// que conflitam com o Prettier.
	eslintConfigPrettier,
])
