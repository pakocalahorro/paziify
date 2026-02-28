# 💎 Manual de Uso: PDS Showcase (Casa Piloto)

Este manual explica cómo utilizar el **Oasis Showcase** como nuestra guía maestra de diseño (Paziify Design System - PDS v3.0) y cómo escalar esos cambios al resto de la aplicación.

---

## 1. Propósito del Showcase
El **Showcase** (o "Casa Piloto") es la pantalla de referencia absoluta para el diseño de Paziify. Sus objetivos son:
*   **Aislamiento**: Probar nuevos componentes o estilos sin afectar la experiencia del usuario final en las pantallas de producción.
*   **Consistencia**: Servir como el estándar visual ("North Star"). Si algo se ve bien en el Showcase, así es como debe verse en toda la app.
*   **Catálogo Vivo**: Permitir que tanto el equipo de diseño como de desarrollo vean cómo interactúan los colores, tipografías y sombras en un entorno real de dispositivo.

## 2. Contenido Actual de la Página
Actualmente, el Showcase (`OasisShowcaseScreen.tsx`) incluye demostraciones de:
1.  **Tipografía Dual**: Ejemplo de la firma en `Caveat` combinada con la estructura en `Outfit`.
2.  **Oasis Cards**: Muestras de variantes `hero`, `default` y `compact`.
3.  **Separadores (Rayo)**: El `SoundwaveSeparator` configurado de borde a borde con texto centrado.
4.  **Acciones Primarias**: Botones (`OasisButton`) en estados Primario, Secundario y Ghost.
5.  **Formularios**: `OasisInput` y `OasisToggle` integrados con el sistema de temas.
6.  **Skeletons**: Demostración de estados de carga animados.

## 3. Cambios Automáticos (Los "Ladrillos")
Ciertos cambios en el Showcase se replican en toda la app **sin intervención manual** porque modifican los cimientos compartidos:

*   **Componentes Individuales**: Si editas un archivo en `src/components/Oasis/` (ej: `OasisCard.tsx`), el cambio se reflejará instantáneamente en el Showcase y en cualquier pantalla que use ese componente.
*   **Tokens de Diseño**: Cambios en colores globales, gradientes o constantes de estilo que los componentes consumen internamente.
*   **Lógica del Rayo**: Como el `SoundwaveSeparator` es un solo archivo centralizado, cualquier ajuste en su animación o grosor afecta a toda la app de inmediato.

## 4. Cambios de Réplica Manual (La "Casa")
Cuando el Showcase se usa para ajustar el **Layout** (cómo se organizan los elementos), esos cambios no se heredan automáticamente y requieren una auditoría del asistente:

*   **Espaciado (Paddings/Margins)**: Si decidimos que entre el título y las tarjetas debe haber 24px en lugar de 20px, este cambio debe copiarse manualmente del Showcase a la `Home`, `Library`, etc.
*   **Orden de Secciones**: Si reubicamos el "Rayo" por debajo de los botones en el Showcase, las otras pantallas mantendrán su orden original hasta que las sincronicemos.
*   **Configuración de Pantalla**: El uso de props como `disableContentPadding` en `OasisScreen` debe ser replicado pantalla por pantalla.

---

> [!IMPORTANT]
> **El Workflow Recomendado:**
> 1.  Realizamos las pruebas de diseño en el **Showcase**.
> 2.  Una vez aprobado el diseño "piloto", solicitamos al asistente: *"Replica el estilo/layout de la sección X del Showcase en toda la aplicación"*.
> 3.  El asistente audita las pantallas (`Home`, `Oasis`, `Library`, etc.) para asegurar que el código sea un reflejo fiel del Showcase.

---
*Paziify Design System v3.0 - Última actualización: Febrero 2026*
