import geoip from "geoip-lite"

const getClientIP = (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
        return xForwardedFor.split(',')[0].trim();
    }
    return (
        req.headers['user-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.connection?.socket?.remoteAddress ||
        '0.0.0.0'
    );
};

const requestInfoMiddleware = (req, res, next) => {
    try {
        const ipAddress = getClientIP(req);

        const geoData = geoip.lookup(ipAddress) || {
            country: 'Unknown',
            region: 'Unknown',
            city: 'Unknown',
            ll: [0, 0],
        };

        const userAgentInfo = req.useragent || {};

        req.clientInfo = {
            ip: ipAddress,
            geolocation: {
                country: geoData.country,
                region: geoData.region,
                city: geoData.city,
                latitude: geoData.ll[0],
                longitude: geoData.ll[1],
            },
            device: {
                isMobile: userAgentInfo.isMobile,
                isDesktop: userAgentInfo.isDesktop,
                isTablet: userAgentInfo.isTablet,
                browser: userAgentInfo.browser || 'Unknown',
                version: userAgentInfo.version || 'Unknown',
                os: userAgentInfo.os || 'Unknown',
                platform: userAgentInfo.platform || 'Unknown',
                source: userAgentInfo.source || 'Unknown',
            },
        };

        next();
    } catch (error) {
        console.error('Error collecting request information:', error);
        next(error);
    }
};

export default requestInfoMiddleware