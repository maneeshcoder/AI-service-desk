import Ticket from "../models/ticket.model";

export async function getDashboardStats() {
  const [statusCounts, priorityCounts, categoryCounts, totalTickets, resolutionStats] =
    await Promise.all([
      Ticket.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
      Ticket.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
      Ticket.countDocuments(),
      Ticket.aggregate([
        { $match: { status: { $in: ["resolved", "closed"] } } },
        {
          $project: {
            resolutionHours: {
              $divide: [{ $subtract: ["$updatedAt", "$createdAt"] }, 1000 * 60 * 60],
            },
          },
        },
        { $group: { _id: null, avgHours: { $avg: "$resolutionHours" } } },
      ]),
    ]);

  const ticketTrend = await Ticket.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return {
    totalTickets,
    byStatus: formatCounts(statusCounts),
    byPriority: formatCounts(priorityCounts),
    byCategory: formatCounts(categoryCounts),
    avgResolutionHours: Math.round((resolutionStats[0]?.avgHours ?? 0) * 10) / 10,
    trend: ticketTrend.map((t) => ({ date: t._id, count: t.count })),
  };
}

function formatCounts(results: { _id: string; count: number }[]) {
  return results.reduce((acc, r) => {
    acc[r._id ?? "unknown"] = r.count;
    return acc;
  }, {} as Record<string, number>);
}