import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { useIntl } from 'react-intl';

type Props = {
    latitude?: number | string | null;
    longitude?: number | string | null;
};

/**
 * Displays the map location of one Deskrl.
 */
export default function DeskrlLocationMap({ latitude, longitude }: Props) {
    const intl = useIntl();

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

    // Returns the translated text for the given translation key.
    const t = (id: string) => intl.formatMessage({ id });

    /**
     * Check whether valid coordinates are available before rendering a map.
     */
    const hasValidCoordinates =
        Number.isFinite(parsedLatitude) &&
        Number.isFinite(parsedLongitude);

    if (!hasValidCoordinates) {
        return (
            <div className="flex h-80 items-center justify-center rounded-3xl bg-[#f4f3ff] px-6 text-center text-gray-600">
                <div>
                    <p className="font-semibold">
                        {t('deskrlMap.noLocationTitle')}
                    </p>

                    <p className="mt-1 text-sm">
                        {t('deskrlMap.noLocationDescription')}
                    </p>
                </div>
            </div>
        );
    }

    if (!apiKey) {
        return (
            <div className="flex h-80 items-center justify-center rounded-3xl bg-[#f4f3ff] px-6 text-center text-gray-600">
                <div>
                    <p className="font-semibold">
                        {t('deskrlMap.apiKeyMissingTitle')}
                    </p>

                    <p className="mt-1 text-sm">
                        {t('deskrlMap.apiKeyMissingDescription')}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <APIProvider apiKey={apiKey}>
            <div className="h-80 overflow-hidden rounded-3xl">
                <Map
                    defaultCenter={{
                        lat: parsedLatitude,
                        lng: parsedLongitude,
                    }}
                    defaultZoom={15}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Marker
                        position={{
                            lat: parsedLatitude,
                            lng: parsedLongitude,
                        }}
                        title="Standort des Deskrls"
                    />
                </Map>
            </div>
        </APIProvider>
    );
}
