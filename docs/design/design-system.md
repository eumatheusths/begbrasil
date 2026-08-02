# Design System & Tokens - BEG Brasil

Este documento define os tokens visuais e arquitetura CSS da interface. O design tem foco em estética industrial de precisão, evitando aparências genéricas e focando na legibilidade e performance B2B.

## 1. Cores (Color Palette)

O azul original (`#1E1AFE`) foi ajustado ligeiramente para um tom mais institucional (`#1e3a8a`, Indigo 900 adaptado) a fim de refletir credibilidade e "indústria de precisão", removendo o aspecto "neon".

### Primárias
- `--color-primary-500`: `#1e40af` (Azul Institucional Base - Interações)
- `--color-primary-600`: `#1e3a8a` (Azul Institucional Escuro - Default)
- `--color-primary-700`: `#172554` (Azul Institucional Muito Escuro - Hover/Active)

### Neutras & Grafite
- `--color-graphite-900`: `#0f172a` (Grafite Principal - Textos e Títulos Fortes)
- `--color-graphite-800`: `#1e293b` (Grafite Suave - Bordas e Divisores Escuros)
- `--color-graphite-500`: `#64748b` (Cinza Textos Secundários)
- `--color-gray-200`: `#e2e8f0` (Bordas claras e Componentes Disabled)
- `--color-gray-100`: `#f1f5f9` (Backgrounds Alternados)
- `--color-white`: `#ffffff` (Fundos principais e textos em botões)

### Semânticas
- `--color-success`: `#15803d`
- `--color-error`: `#b91c1c`
- `--color-warning`: `#b45309`

## 2. Tipografia (Typography)
Foco em legibilidade e precisão, utilizando a família `Inter`.

- `--font-primary`: `'Inter', system-ui, -apple-system, sans-serif`
- `--text-xs`: `0.75rem` (12px)
- `--text-sm`: `0.875rem` (14px)
- `--text-base`: `1rem` (16px)
- `--text-lg`: `1.125rem` (18px)
- `--text-xl`: `1.25rem` (20px)
- `--text-2xl`: `1.5rem` (24px)
- `--text-3xl`: `1.875rem` (30px)
- `--text-4xl`: `2.25rem` (36px)

**Pesos:**
- `--font-regular`: `400`
- `--font-medium`: `500`
- `--font-semibold`: `600`
- `--font-bold`: `700`

## 3. Espaçamento (Spacing)
- `--space-1`: `4px`
- `--space-2`: `8px`
- `--space-3`: `12px`
- `--space-4`: `16px`
- `--space-6`: `24px`
- `--space-8`: `32px`
- `--space-12`: `48px`
- `--space-16`: `64px`
- `--space-24`: `96px`

## 4. Layout e Breakpoints
- `--max-width-container`: `1200px`
- `--bp-sm`: `640px`
- `--bp-md`: `768px`
- `--bp-lg`: `1024px`
- `--bp-xl`: `1280px`

## 5. Bordas (Borders) e Sombras (Shadows)
As sombras imitam luz metálica discreta.
- `--radius-sm`: `4px`
- `--radius-md`: `6px`
- `--radius-lg`: `8px`
- `--radius-full`: `9999px`
- `--shadow-sm`: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`
- `--shadow-md`: `0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1)`
- `--shadow-lg`: `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)`

## 6. Animações (Transitions)
- `--transition-fast`: `150ms ease-in-out`
- `--transition-normal`: `250ms ease-in-out`
- `--transition-slow`: `350ms ease-in-out`

## 7. Acessibilidade (WCAG AA)
- Todos os textos sobre fundos escuros (Azul Institucional ou Grafite 900) utilizarão `--color-white` ou variação que atinja contraste >= 4.5:1.
- Elementos desativados (disabled) manterão um contraste >= 3.0:1 com fundos adjacentes.
- Estados de Focus terão outline claro para navegação via teclado (`outline: 2px solid var(--color-primary-500); outline-offset: 2px`).
