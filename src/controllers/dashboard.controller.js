const ApiResponse = require('../utils/apiResponse');
const dashboardService = require('../services/dashboard.service');

const getActivity = async (req, res, next) => {
  try {
    const { limit, module } = req.query;
    const data = await dashboardService.getActivity(req.companyId, { limit, module });
    return ApiResponse.success(res, data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivity };
