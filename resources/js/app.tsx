import '../css/app.css';
import {createInertiaApp} from '@inertiajs/react';
import {createRoot} from 'react-dom/client';
import {IntlProvider} from 'react-intl';
import {FavoritesProvider} from '@/contexts/FavoritesContext';

import deMessages from '@/lang/de.json';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.tsx', {eager: true});

        const path = `./Pages/${name}.tsx`;
        const page = pages[path] as any;

        if (!page) {
            console.error('INERTIA PAGE NOT FOUND:', path);
            console.error('Requested name:', name);
            console.error('Available pages:', Object.keys(pages));

            throw new Error(`INERTIA PAGE NOT FOUND: ${path}`);
        }

        return page.default;
    },

    setup({el, App, props}) {
        const pageProps = props.initialPage.props as any;
        const isLoggedIn = !!pageProps.auth?.user;

        createRoot(el).render(
            <IntlProvider locale="de" messages={deMessages}>
                <FavoritesProvider isLoggedIn={isLoggedIn}>
                    <App {...props} />
                </FavoritesProvider>
            </IntlProvider>
        );
    },
});
/*
import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { JSX, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { FavoritesProvider } from '@/contexts/FavoritesContext';

createInertiaApp({
    // resolve: async name => {
    //     const pages = import.meta.glob('./pages/!**!/!*.tsx', { eager: true });
    //
    //     const page = pages[`./pages/${name}.tsx`] as {
    //         default: {
    //             layout?: (page: ReactNode) => JSX.Element;
    //         };
    //     };
    //
    //     page.default.layout =
    //         page.default.layout ||
    //         ((page: ReactNode) => <AppLayout>{page}</AppLayout>);
    //
    //     return page;
    // },
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/!**!/!*.tsx', { eager: true })

        const path = `./Pages/${name}.tsx`
        const page = pages[path] as any

        if (!page) {
            console.error('INERTIA PAGE NOT FOUND:', path)
            console.error('Requested name:', name)
            console.error('Available pages:', Object.keys(pages))

            throw new Error(`INERTIA PAGE NOT FOUND: ${path}`)
        }

        return page.default
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },

    // setup({ el, App, props }) {
    //     const root = createRoot(el);
    //
    //     const pageProps = props.initialPage.props as any;
    //     const isLoggedIn = !!pageProps.auth?.user;
    //
    //     root.render(
    //         <FavoritesProvider isLoggedIn={isLoggedIn}>
    //             <App {...props} />
    //         </FavoritesProvider>
    //     );
    // },
});
*/
