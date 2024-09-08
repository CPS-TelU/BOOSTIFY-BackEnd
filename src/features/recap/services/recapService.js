const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk mendapatkan rangkuman kehadiran
const getAttendanceRecap = async (page = 1, limit = 5, untilDate) => {
    const topLimit = 3;
    const skip = (page - 1) * limit;
    const dateFilter = untilDate ? new Date(`${untilDate}T23:59:59.999Z`) : undefined;

    // Mengambil data kehadiran teratas (page 1)
    const topAttendances = page === 1 ? await prisma.attendance.groupBy({
        by: ['name'],
        _count: {
            name: true,
        },
        orderBy: {
            _count: {
                name: 'desc',
            },
        },
        take: topLimit,
    }) : [];

    const topNames = topAttendances.map(item => item.name);

    // Mengambil kehadiran lain setelah kehadiran teratas
    const otherAttendances = await prisma.attendance.groupBy({
        by: ['name'],
        _count: {
            name: true,
        },
        orderBy: {
            _count: {
                name: 'desc',
            },
        },
        where: {
            name: {
                notIn: topNames, // Jangan ambil nama yang ada di top 3
            },
        },
        skip: page === 1 ? 0 : skip - topLimit,
        take: limit,
    });

    // Gabungkan hasil kehadiran teratas dan kehadiran lainnya
    const allAttendances = [...topAttendances, ...otherAttendances];

    // Dapatkan detail kehadiran (termasuk `assisstant_code` dan `time`)
    const attendances = await prisma.attendance.findMany({
        where: {
            name: {
                in: allAttendances.map(item => item.name),
            },
            time: dateFilter ? { lte: dateFilter } : undefined,
        },
        select: {
            name: true,
            assisstant_code: true,
            time: true,
        },
        orderBy: {
            time: 'desc', // Ambil kehadiran terbaru
        },
        distinct: ['name'], // Hanya ambil satu entry per name
    });

    // Gabungkan data kehadiran dengan total kehadiran untuk setiap nama
    const finalAttendances = attendances.map(att => ({
        name: att.name,
        assisstant_code: att.assisstant_code,
        lastAttendance: att.time,
        totalAttendance: allAttendances.find(a => a.name === att.name)._count.name,
    }));

    // Hitung total nama di dalam tabel attendance
    const totalNames = await prisma.attendance.groupBy({
        by: ['name'],
        _count: {
            name: true,
        },
        where: {
            time: dateFilter ? { lte: dateFilter } : undefined,
        },
    });

    // Kembalikan hasil yang sudah difilter
    return {
        attendances: finalAttendances,
        total: totalNames.length,
        currentPage: page,
        totalPages: Math.ceil((totalNames.length - topLimit) / limit) + 1,
    };
};

module.exports = {
    getAttendanceRecap,
};
