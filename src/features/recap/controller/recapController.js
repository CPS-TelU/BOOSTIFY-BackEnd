const { getAttendanceRecap } = require('../services/recapService');

const getAttendanceRecapController = async (req, res) => {
    try {
        const { page = 1, limit = 5} = req.query;
        const recapData = await getAttendanceRecap(Number(page), Number(limit));
        
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'attendance_recap',
                    data: recapData,
                }));
            }
        });

        res.status(200).json({
            success: true,
            payload: recapData.attendances,
            pagination: {
                totalItems: recapData.total,
                totalPages: recapData.totalPages,
                currentPage: recapData.currentPage,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the attendance recap data',
            error: error.message,
        });
    }
};

module.exports = getAttendanceRecapController;
