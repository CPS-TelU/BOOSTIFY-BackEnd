const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAttendanceRecap = async (page = 1, limit = 5) => {
    const topLimit = 3;
    let skip = (page - 1) * limit;

    // Ambil data user yang memiliki kehadiran terbanyak
    const topAttendances = await prisma.attendance.groupBy({
        by: ['name'],
        _count: {
            name: true,
        },
        orderBy: {
            _count: {
                name: 'desc',
            },
        },
        take: topLimit + limit,  // Ambil top 3 + sisanya berdasarkan paginasi
        skip: page === 1 ? 0 : topLimit + skip, // Skip data sesuai dengan page
    });

    // Ambil semua nama yang telah diproses
    const names = topAttendances.map(item => item.name);

    // Ambil data kehadiran terakhir untuk setiap nama
    const attendanceDetails = await prisma.attendance.findMany({
        where: {
            name: { in: names },
        },
        distinct: ['name'], // Ambil satu data terbaru untuk setiap nama
        orderBy: { time: 'desc' },
        select: {
            name: true,
            assisstant_code: true,
            time: true,
        },
    });

    // Gabungkan data kehadiran berdasarkan nama
    const attendances = topAttendances.map(item => {
        const detail = attendanceDetails.find(detail => detail.name === item.name);
        return {
            name: item.name,
            assisstant_code: detail ? detail.assisstant_code : null,
            lastAttendance: detail ? detail.time : null,
            totalAttendance: item._count.name,
        };
    });

    // Hitung total semua user yang pernah hadir
    const totalNames = await prisma.attendance.groupBy({
        by: ['name'],
        _count: {
            name: true,
        },
    });

    const result = {
        attendances,
        total: totalNames.length, // Total semua user
        currentPage: page,
        totalPages: Math.ceil((totalNames.length - topLimit) / limit) + 1,
    };

    // Kirim data ke semua client melalui WebSocket jika ws tersedia
    if (ws) {
        ws.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({
                    type: 'attendance_recap',
                    data: result,
                }));
            }
        });
    }

    return result;
};

module.exports = {
    getAttendanceRecap,
};
