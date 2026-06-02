import { APIProvider, Map } from '@vis.gl/react-google-maps';

type Props = {
    latitude?: number | string | null;
    longitude?: number | string | null;
};

/**
 * Displays the map location of one Deskrl.
 */
export default function DeskrlLocationMap({ latitude, longitude }: Props) {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
    const parsedLatitude = Number(latitude);
    const parsedLongitude = Number(longitude);

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
                    <p className="font-semibold">Kein Kartenstandort verfügbar</p>
                    <p className="mt-1 text-sm">
                        Für diese Adresse wurden noch keine Koordinaten hinterlegt.
                    </p>
                </div>
            </div>
        );
    }

    if (!apiKey) {
        return (
            <div className="flex h-80 items-center justify-center rounded-3xl bg-[#f4f3ff] px-6 text-center text-gray-600">
                <div>
                    <p className="font-semibold">Google Maps wird hier angezeigt</p>
                    <p className="mt-1 text-sm">
                        Der Google Maps API Key muss noch in der Projektkonfiguration hinterlegt werden.
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
                />
            </div>
        </APIProvider>
    );
}
