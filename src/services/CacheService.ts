import * as FileSystem from 'expo-file-system/legacy';
import * as Crypto from 'expo-crypto';

/**
 * Paziify CacheService v1.0
 * El "Escudo" de datos de la plataforma.
 * Gestiona la persistencia de audio e imágenes para eliminar el Egress de Supabase.
 */

// Tipos de recursos para decidir el directorio de almacenamiento
export type CacheResourceType = 'audio' | 'image' | 'soundscape' | 'binaural';

class CacheService {
    private persistentDir = `${FileSystem.documentDirectory}paziify_assets/`;
    private volatileDir = `${FileSystem.cacheDirectory}paziify_cache/`;

    constructor() {
        this.ensureDirectories();
    }

    /**
     * Asegura que los directorios de trabajo existan
     */
    private async ensureDirectories() {
        try {
            const pInfo = await FileSystem.getInfoAsync(this.persistentDir);
            if (!pInfo.exists) {
                await FileSystem.makeDirectoryAsync(this.persistentDir, { intermediates: true });
            }

            const vInfo = await FileSystem.getInfoAsync(this.volatileDir);
            if (!vInfo.exists) {
                await FileSystem.makeDirectoryAsync(this.volatileDir, { intermediates: true });
            }
        } catch (error) {
            console.error('CacheService: Error creating directories', error);
        }
    }

    /**
     * Genera un nombre de archivo único y seguro basado en la URL
     */
    private async getFilename(url: string): Promise<string> {
        const hash = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.MD5,
            url
        );
        // Extraemos la extensión original si existe
        const extension = url.split('.').pop()?.split('?')[0] || '';
        return `${hash}${extension ? '.' + extension : ''}`;
    }

    /**
     * Obtiene la ruta local de un recurso. Si no existe, lo descarga.
     * @param url URL remota del recurso (Supabase/CDN)
     * @param type Tipo de recurso para determinar persistencia
     */
    async get(url: string, type: CacheResourceType = 'audio'): Promise<string> {
        if (!url) return '';

        // Si ya es una ruta local, devolverla tal cual
        if (url.startsWith('file://') || url.startsWith('content://')) {
            return url;
        }

        const filename = await this.getFilename(url);
        const isPersistent = type === 'audio' || type === 'soundscape';
        const targetDir = isPersistent ? this.persistentDir : this.volatileDir;
        const localUri = `${targetDir}${filename}`;

        try {
            // 1. Verificar si ya existe
            const info = await FileSystem.getInfoAsync(localUri);
            if (info.exists) {
                // console.log(`Cache HIT: ${filename}`);
                return localUri;
            }

            // 2. Descargar si no existe (Cache Miss)
            // console.log(`Cache MISS: Downloading ${url} -> ${filename}`);

            // Obtener el Anon Key para las descargas de Supabase
            const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
            const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
            const isSupabaseUrl = supabaseUrl && url.includes(supabaseUrl);

            // Descarga atómica: Descargamos a un temporal y luego movemos
            const tempUri = `${localUri}.tmp`;
            const downloadOptions = isSupabaseUrl ? {
                headers: {
                    'apikey': supabaseAnonKey,
                    'Authorization': `Bearer ${supabaseAnonKey}`
                }
            } : {};

            const downloadRes = await FileSystem.downloadAsync(url, tempUri, downloadOptions);

            if (downloadRes.status !== 200) {
                throw new Error(`Download failed with status ${downloadRes.status}`);
            }

            // Mover de temporal a final
            await FileSystem.moveAsync({
                from: tempUri,
                to: localUri
            });

            return localUri;
        } catch (error) {
            console.warn(`CacheService: Fallback to remote URL for ${url}`, error);
            // Fallback: Si algo falla, devolvemos la URL original para no romper la app
            return url;
        }
    }

    /**
     * Borra solo la caché volátil (imágenes, etc)
     */
    async clearVolatileCache() {
        try {
            await FileSystem.deleteAsync(this.volatileDir, { idempotent: true });
            await FileSystem.makeDirectoryAsync(this.volatileDir, { intermediates: true });
            console.log('CacheService: Volatile cache cleared');
        } catch (error) {
            console.error('CacheService: Error clearing volatile cache', error);
        }
    }

    /**
     * Obtiene el tamaño total de la caché (persistente + volátil)
     */
    async getCacheSize(): Promise<{ persistent: number; volatile: number }> {
        // Nota: Implementación simplificada, en entornos reales se recorrería el directorio
        return { persistent: 0, volatile: 0 };
    }
}

export default new CacheService();
