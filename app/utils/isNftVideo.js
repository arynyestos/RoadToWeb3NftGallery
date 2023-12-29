export async function isNftVideo(url) {
    if (url.endsWith('mp4') ||
        url.endsWith('mkv') ||
        url.endsWith('mov') ||
        url.endsWith('wmw') ||
        url.endsWith('avi')) {
        return true;
    }
    if (url.endsWith('png') ||
        url.endsWith('jpg') ||
        url.endsWith('gif')) {
        return false;
    }
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        // Magic bytes signatures
        const magicBytes = {
            // Firmas de imágenes
            'ffd8ffe0': 'image/jpeg',
            '89504e47': 'image/png',
            '47494638': 'image/gif',
            // Firmas de videos
            '00000018': 'video/mp4',
            '464c5601': 'video/quicktime',
        };

        const signature = Array.from(bytes.slice(0, 4))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');

        const mimeType = magicBytes[signature] || '';
        return mimeType.startsWith('video/');
    } catch (error) {
        console.error('Error checking file type:', error);
        return false;
    }
}



