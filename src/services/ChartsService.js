import BonusRequestSchema from "../entites/BonusRequestSchema.js";
import mongoose from "mongoose";
import {request} from "express";

class ChartsService {
  async getDataForLinecharts(companyId) {
    const participationData = await BonusRequestSchema.aggregate([
      {
        $match: {
          'bonus.company': new mongoose.Types.ObjectId(companyId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
        },
      },
    ]);
    return participationData;
  }
}

export default new ChartsService();
