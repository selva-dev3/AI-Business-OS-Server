"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = exports.restoreVersion = exports.getVersions = exports.share = exports.download = exports.remove = exports.update = exports.getById = exports.create = exports.list = exports.removeFolder = exports.updateFolder = exports.createFolder = exports.getFolderById = exports.listRoot = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Document_1 = __importDefault(require("../models/Document"));
const DocumentFolder_1 = __importDefault(require("../models/DocumentFolder"));
const DocumentVersion_1 = __importDefault(require("../models/DocumentVersion"));
const DocumentShare_1 = __importDefault(require("../models/DocumentShare"));
const appError_1 = __importDefault(require("../utils/appError"));
const helpers_1 = require("../utils/helpers");
const listRoot = async (companyId) => {
    const folders = await DocumentFolder_1.default.find({ companyId, parentId: null }).sort({ name: 1 });
    const unclassified = await Document_1.default.find({ companyId, folderId: null }).sort({ createdAt: -1 });
    return { folders, unclassified };
};
exports.listRoot = listRoot;
const getFolderById = async (companyId, folderId) => {
    const folder = await DocumentFolder_1.default.findOne({ _id: folderId, companyId });
    if (!folder)
        throw new appError_1.default(404, 'NOT_FOUND', 'Folder not found');
    const subfolders = await DocumentFolder_1.default.find({ parentId: folderId, companyId }).sort({ name: 1 });
    const documents = await Document_1.default.find({ folderId, companyId }).sort({ createdAt: -1 });
    return { folder, subfolders, documents };
};
exports.getFolderById = getFolderById;
const createFolder = async (companyId, userId, data) => {
    if (data.parentId) {
        const parent = await DocumentFolder_1.default.findOne({ _id: data.parentId, companyId });
        if (!parent)
            throw new appError_1.default(404, 'NOT_FOUND', 'Parent folder not found');
    }
    const existing = await DocumentFolder_1.default.findOne({ companyId, name: data.name, parentId: data.parentId || null });
    if (existing)
        throw new appError_1.default(409, 'CONFLICT', 'Folder with this name already exists at this location');
    const folder = await DocumentFolder_1.default.create({
        ...data,
        parentId: data.parentId || null,
        companyId,
        createdBy: userId,
    });
    return folder;
};
exports.createFolder = createFolder;
const updateFolder = async (companyId, folderId, data) => {
    const folder = await DocumentFolder_1.default.findOneAndUpdate({ _id: folderId, companyId }, data, {
        new: true,
        runValidators: true,
    });
    if (!folder)
        throw new appError_1.default(404, 'NOT_FOUND', 'Folder not found');
    return folder;
};
exports.updateFolder = updateFolder;
const removeFolder = async (companyId, folderId) => {
    const folder = await DocumentFolder_1.default.findOne({ _id: folderId, companyId });
    if (!folder)
        throw new appError_1.default(404, 'NOT_FOUND', 'Folder not found');
    const subfolderCount = await DocumentFolder_1.default.countDocuments({ parentId: folderId, companyId });
    const docCount = await Document_1.default.countDocuments({ folderId, companyId });
    if (subfolderCount > 0 || docCount > 0) {
        throw new appError_1.default(400, 'BAD_REQUEST', 'Folder is not empty. Remove all subfolders and documents first.');
    }
    await DocumentFolder_1.default.deleteOne({ _id: folderId });
    return { success: true };
};
exports.removeFolder = removeFolder;
const list = async (companyId, query = {}) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.folderId)
        filter.folderId = query.folderId;
    if (query.folderId === 'null')
        filter.folderId = null;
    if (query.tags)
        filter.tags = { $in: Array.isArray(query.tags) ? query.tags : [query.tags] };
    if (query.search) {
        const searchFilter = (0, helpers_1.buildSearchQuery)(query.search, ['name', 'description']);
        Object.assign(filter, searchFilter);
    }
    const [data, total] = await Promise.all([
        Document_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('uploadedBy', 'firstName lastName'),
        Document_1.default.countDocuments(filter),
    ]);
    return { data, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.list = list;
const create = async (companyId, userId, data, file) => {
    if (!file)
        throw new appError_1.default(400, 'BAD_REQUEST', 'File is required');
    if (data.folderId) {
        const folder = await DocumentFolder_1.default.findOne({ _id: data.folderId, companyId });
        if (!folder)
            throw new appError_1.default(404, 'NOT_FOUND', 'Folder not found');
    }
    const document = await Document_1.default.create({
        name: data.name || file.originalname,
        description: data.description || '',
        fileUrl: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        extension: file.originalname.split('.').pop() || '',
        tags: data.tags || [],
        companyId,
        folderId: data.folderId || null,
        uploadedBy: userId,
    });
    await DocumentVersion_1.default.create({
        documentId: document._id,
        version: 1,
        fileUrl: file.path,
        fileSize: file.size,
        createdBy: userId,
    });
    return document;
};
exports.create = create;
const getById = async (companyId, documentId) => {
    const document = await Document_1.default.findOne({ _id: documentId, companyId }).populate('uploadedBy', 'firstName lastName');
    if (!document)
        throw new appError_1.default(404, 'NOT_FOUND', 'Document not found');
    return document;
};
exports.getById = getById;
const update = async (companyId, documentId, data) => {
    const document = await Document_1.default.findOneAndUpdate({ _id: documentId, companyId }, data, {
        new: true,
        runValidators: true,
    });
    if (!document)
        throw new appError_1.default(404, 'NOT_FOUND', 'Document not found');
    return document;
};
exports.update = update;
const remove = async (companyId, documentId) => {
    const document = await Document_1.default.findOneAndDelete({ _id: documentId, companyId });
    if (!document)
        throw new appError_1.default(404, 'NOT_FOUND', 'Document not found');
    await Promise.all([
        DocumentVersion_1.default.deleteMany({ documentId }),
        DocumentShare_1.default.deleteMany({ documentId }),
    ]);
    return { success: true };
};
exports.remove = remove;
const download = async (companyId, documentId) => {
    const document = await Document_1.default.findOne({ _id: documentId, companyId });
    if (!document)
        throw new appError_1.default(404, 'NOT_FOUND', 'Document not found');
    return document;
};
exports.download = download;
const share = async (companyId, documentId, data, _userId) => {
    const document = await Document_1.default.findOne({ _id: documentId, companyId });
    if (!document)
        throw new appError_1.default(404, 'NOT_FOUND', 'Document not found');
    const shares = [];
    if (data.userIds?.length > 0) {
        for (const targetUserId of data.userIds) {
            const existing = await DocumentShare_1.default.findOne({ documentId, userId: targetUserId });
            if (existing) {
                existing.access = data.access || 'VIEW';
                await existing.save();
                shares.push(existing);
            }
            else {
                const share = await DocumentShare_1.default.create({
                    documentId,
                    userId: targetUserId,
                    access: data.access || 'VIEW',
                });
                shares.push(share);
            }
        }
    }
    if (data.generateLink && !document.shareToken) {
        const shareToken = crypto_1.default.randomBytes(32).toString('hex');
        document.shareToken = shareToken;
        document.isShared = true;
        await document.save();
    }
    else if (data.generateLink && document.shareToken) {
        document.isShared = true;
        await document.save();
    }
    return { shares, shareToken: document.shareToken, isShared: document.isShared };
};
exports.share = share;
const getVersions = async (companyId, documentId) => {
    const document = await Document_1.default.findOne({ _id: documentId, companyId });
    if (!document)
        throw new appError_1.default(404, 'NOT_FOUND', 'Document not found');
    const versions = await DocumentVersion_1.default.find({ documentId }).sort({ version: -1 });
    return versions;
};
exports.getVersions = getVersions;
const restoreVersion = async (companyId, documentId, versionNumber) => {
    const document = await Document_1.default.findOne({ _id: documentId, companyId });
    if (!document)
        throw new appError_1.default(404, 'NOT_FOUND', 'Document not found');
    const version = await DocumentVersion_1.default.findOne({ documentId, version: parseInt(versionNumber) });
    if (!version)
        throw new appError_1.default(404, 'NOT_FOUND', 'Version not found');
    const newVersion = (document.version || 0) + 1;
    await DocumentVersion_1.default.create({
        documentId,
        version: newVersion,
        fileUrl: version.fileUrl,
        fileSize: version.fileSize,
        createdBy: document.uploadedBy,
    });
    document.fileUrl = version.fileUrl;
    document.fileSize = version.fileSize;
    document.version = newVersion;
    await document.save();
    return document;
};
exports.restoreVersion = restoreVersion;
const search = async (companyId, query = {}) => {
    const { page, limit, skip } = (0, helpers_1.paginateQuery)(query.page, Number(query.limit));
    const filter = { companyId };
    if (query.q) {
        const searchFilter = (0, helpers_1.buildSearchQuery)(query.q, ['name', 'description', 'tags']);
        Object.assign(filter, searchFilter);
    }
    if (query.tags) {
        filter.tags = { $in: Array.isArray(query.tags) ? query.tags : [query.tags] };
    }
    if (query.mimeType)
        filter.mimeType = query.mimeType;
    if (query.folderId)
        filter.folderId = query.folderId;
    const [data, total] = await Promise.all([
        Document_1.default.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('uploadedBy', 'firstName lastName'),
        Document_1.default.countDocuments(filter),
    ]);
    return { data, meta: (0, helpers_1.buildMeta)(total, page, limit) };
};
exports.search = search;
//# sourceMappingURL=document.service.js.map