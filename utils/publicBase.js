// utils/publicBase.js
function sanitizeBase(u) {
    return u;
    // const s = String(u || '').trim();
    // if (!s) return null;
    // if (!/^https?:\/\//i.test(s)) return null; // exige http/https
    // // supprime uniquement les slashes finaux (pas de regex sur des chiffres !)
    // // return s.replace(/\/+$/, '');

}

function publicBase(req) {
    const envBase = sanitizeBase(process.env.PUBLIC_BASE_URL);
    if (envBase) return envBase;

    // Fallback: reconstruit via la requête (proxy-safe)
    const protoHdr = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const proto = String(protoHdr).split(',')[0].trim() || 'http';
    const host = req.headers['x-forwarded-host'] || req.get('host');

    if (!host) {
        throw new Error("Impossible de déterminer l'hôte public. Définis PUBLIC_BASE_URL.");
    }
    return `${proto}://${host}`.replace(/\/+$/, '');
}

module.exports = { publicBase };