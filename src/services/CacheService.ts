import * as FileSystem from 'expo-file-system/legacy';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    private MANIFEST_KEY = '@paziify_cache_manifest';
    private TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

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
            // 1. Verificar si ya existe y no ha expirado
            const info = await FileSystem.getInfoAsync(localUri);
            
            if (info.exists) {
                const manifest = await this.getManifest();
                const cachedAt = manifest[filename]?.cachedAt;
                const isExpired = isPersistent && cachedAt && (Date.now() - cachedAt > this.TTL_MS);

                if (!isExpired) {
                    // console.log(`Cache HIT: ${filename}`);
                    return localUri;
                }
                
                if (isExpired) {
                    // console.log(`Cache EXPIRED: ${filename}, deleting...`);
                    await FileSystem.deleteAsync(localUri, { idempotent: true });
                }
            }

            // 2. Descargar si no existe o expiró
            // console.log(`Cache MISS/EXP: Downloading ${url} -> ${filename}`);

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

            // Actualizar manifest
            await this.updateManifest(filename, url);

            return localUri;
        } catch (error) {
            console.warn(`CacheService: Fallback to remote URL for ${url}`, error);
            // Fallback: Si algo falla, devolvemos la URL original para no romper la app
            return url;
        }
    }

    /**
     * Gestión del Manifest de Caché
     */
    private async getManifest(): Promise<Record<string, { cachedAt: number, url: string }>> {
        try {
            const raw = await AsyncStorage.getItem(this.MANIFEST_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    }

    private async updateManifest(filename: string, url: string) {
        try {
            const manifest = await this.getManifest();
            manifest[filename] = {
                cachedAt: Date.now(),
                url: url
            };
            await AsyncStorage.setItem(this.MANIFEST_KEY, JSON.stringify(manifest));
        } catch (error) {
            console.error('CacheService: Error updating manifest', error);
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
        try {
            const getDirSize = async (dir: string): Promise<number> => {
                const info = await FileSystem.getInfoAsync(dir);
                if (!info.exists) return 0;
                
                const files = await FileSystem.readDirectoryAsync(dir);
                let total = 0;
                for (const file of files) {
                    const fInfo = await FileSystem.getInfoAsync(`${dir}${file}`);
                    if (fInfo.exists && !fInfo.isDirectory) {
                        total += fInfo.size || 0;
                    }
                }
                return total;
            };

            const [pSize, vSize] = await Promise.all([
                getDirSize(this.persistentDir),
                getDirSize(this.volatileDir)
            ]);

            return { persistent: pSize, volatile: vSize };
        } catch (error) {
            console.error('CacheService: Error getting cache size', error);
            return { persistent: 0, volatile: 0 };
        }
    }
}

export default new CacheService();
