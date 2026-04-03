import { getSiteStatistics as getSiteStatisticsService } from "../services/statistics.service.js";

export const getSiteStatistics = async (req, res) => {
  const statistics = await getSiteStatisticsService();
  res.json(statistics);
};
