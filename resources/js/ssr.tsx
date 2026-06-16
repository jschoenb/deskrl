import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { renderToString } from 'react-dom/server';
import { IntlProvider } from 'react-intl';

import deMessages from '@/lang/de.json';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const messages = deMessages as Record<string, string>;

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => (
            <IntlProvider locale="de" messages={messages}>
                <App {...props} />
            </IntlProvider>
        ),
    }),
);
