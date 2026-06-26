const ApiResponse = require('../utils/apiResponse');
const documentService = require('../services/document.service');

const listRoot = async (req, res, next) => {
  try {
    const result = await documentService.listRoot(req.companyId);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const getFolderById = async (req, res, next) => {
  try {
    const result = await documentService.getFolderById(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const createFolder = async (req, res, next) => {
  try {
    const folder = await documentService.createFolder(req.companyId, req.user._id, req.body);
    return ApiResponse.created(res, folder);
  } catch (error) {
    next(error);
  }
};

const updateFolder = async (req, res, next) => {
  try {
    const folder = await documentService.updateFolder(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, folder);
  } catch (error) {
    next(error);
  }
};

const removeFolder = async (req, res, next) => {
  try {
    const result = await documentService.removeFolder(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const list = async (req, res, next) => {
  try {
    const result = await documentService.list(req.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const document = await documentService.create(req.companyId, req.user._id, req.body, req.file);
    return ApiResponse.created(res, document);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const document = await documentService.getById(req.companyId, req.params.id);
    return ApiResponse.success(res, document);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    req.originalBody = req.body;
    const document = await documentService.update(req.companyId, req.params.id, req.body);
    return ApiResponse.success(res, document);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await documentService.remove(req.companyId, req.params.id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const download = async (req, res, next) => {
  try {
    const document = await documentService.download(req.companyId, req.params.id);
    res.download(document.fileUrl, document.name);
  } catch (error) {
    next(error);
  }
};

const share = async (req, res, next) => {
  try {
    const result = await documentService.share(req.companyId, req.params.id, req.body, req.user._id);
    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
};

const getVersions = async (req, res, next) => {
  try {
    const versions = await documentService.getVersions(req.companyId, req.params.id);
    return ApiResponse.success(res, versions);
  } catch (error) {
    next(error);
  }
};

const restoreVersion = async (req, res, next) => {
  try {
    const document = await documentService.restoreVersion(req.companyId, req.params.id, req.params.version);
    return ApiResponse.success(res, document);
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const result = await documentService.search(req.companyId, req.query);
    return ApiResponse.paginated(res, result.data, result.meta);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listRoot,
  getFolderById,
  createFolder,
  updateFolder,
  removeFolder,
  list,
  create,
  getById,
  update,
  remove,
  download,
  share,
  getVersions,
  restoreVersion,
  search,
};
