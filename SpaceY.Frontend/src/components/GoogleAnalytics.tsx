'use client';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

// Component chính sử dụng useSearchParams
const GoogleAnalyticsCore = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!GA_TRACKING_ID) return;

        const url = pathname + searchParams.toString();

        window.gtag('config', GA_TRACKING_ID, {
            page_path: url,
        });
    }, [pathname, searchParams]);

    if (!GA_TRACKING_ID) {
        return null;
    }

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
                }}
            />
        </>
    );
};

// Component wrapper với Suspense
export const GoogleAnalytics = () => {
    return (
        <Suspense fallback={null}>
            <GoogleAnalyticsCore />
        </Suspense>
    );
};