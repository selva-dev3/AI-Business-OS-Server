import crypto from 'crypto';
import Document from '../models/Document';
import DocumentFolder from '../models/DocumentFolder';
import DocumentVersion from '../models/DocumentVersion';
import DocumentShare from '../models/DocumentShare';
import AppError from '../utils/appError';
import { paginateQuery, buildMeta, buildSearchQuery } from '../utils/helpers';

const listRoot = async (companyId: string) => {
  const folders = await DocumentFolder.find({ companyId, parentId: null }).sort({ name: 1 });
  const unclassified = await Document.find({ companyId, folderId: null }).sort({ createdAt: -1 });
  return { folders, unclassified };
};

const getFolderById = async (companyId: string, folderId: string) => {
  const folder = await DocumentFolder.findOne({ _id: folderId, companyId });
  if (!folder) throw new AppError(404, 'NOT_FOUND', 'Folder not found');

  const subfolders = await DocumentFolder.find({ parentId: folderId, companyId }).sort({ name: 1 });
  const documents = await Document.find({ folderId, companyId }).sort({ createdAt: -1 });

  return { folder, subfolders, documents };
};

const createFolder = async (companyId: string, userId: string, data: { name: string; parentId?: string }) => {
  if (data.parentId) {
    const parent = await DocumentFolder.findOne({ _id: data.parentId, companyId });
    if (!parent) throw new AppError(404, 'NOT_FOUND', 'Parent folder not found');
  }

  const existing = await DocumentFolder.findOne({ companyId, name: data.name, parentId: data.parentId || null });
  if (existing) throw new AppError(409, 'CONFLICT', 'Folder with this name already exists at this location');

  const folder = await DocumentFolder.create({
    ...data,
    parentId: data.parentId || null,
    companyId,
    createdBy: userId,
  });
  return folder;
};

const updateFolder = async (companyId: string, folderId: string, data: Record<string, unknown>) => {
  const folder = await DocumentFolder.findOneAndUpdate({ _id: folderId, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!folder) throw new AppError(404, 'NOT_FOUND', 'Folder not found');
  return folder;
};

const removeFolder = async (companyId: string, folderId: string) => {
  const folder = await DocumentFolder.findOne({ _id: folderId, companyId });
  if (!folder) throw new AppError(404, 'NOT_FOUND', 'Folder not found');

  const subfolderCount = await DocumentFolder.countDocuments({ parentId: folderId, companyId });
  const docCount = await Document.countDocuments({ folderId, companyId });
  if (subfolderCount > 0 || docCount > 0) {
    throw new AppError(400, 'BAD_REQUEST', 'Folder is not empty. Remove all subfolders and documents first.');
  }

  await DocumentFolder.deleteOne({ _id: folderId });
  return { success: true };
};

const list = async (companyId: string, query: Record<string, unknown> = {}) => {
  const { page, limit, skip } = paginateQuery(query.page as string, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

  if (query.folderId) filter.folderId = query.folderId;
  if (query.folderId === 'null') filter.folderId = null;
  if (query.tags) filter.tags = { $in: Array.isArray(query.tags) ? query.tags : [query.tags] };

  if (query.search) {
    const searchFilter = buildSearchQuery(query.search as string, ['name', 'description']);
    Object.assign(filter, searchFilter);
  }

  const [data, total] = await Promise.all([
    Document.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('uploadedBy', 'firstName lastName'),
    Document.countDocuments(filter),
  ]);

  return { data, meta: buildMeta(total, page, limit) };
};

const create = async (companyId: string, userId: string, data: Record<string, unknown>, file: { originalname: string; path: string; size: number; mimetype: string }) => {
  if (!file) throw new AppError(400, 'BAD_REQUEST', 'File is required');

  if (data.folderId) {
    const folder = await DocumentFolder.findOne({ _id: data.folderId, companyId });
    if (!folder) throw new AppError(404, 'NOT_FOUND', 'Folder not found');
  }

  const document = await Document.create({
    name: (data.name as string) || file.originalname,
    description: (data.description as string) || '',
    fileUrl: file.path,
    fileSize: file.size,
    mimeType: file.mimetype,
    extension: file.originalname.split('.').pop() || '',
    tags: (data.tags as string[]) || [],
    companyId,
    folderId: (data.folderId as string) || null,
    uploadedBy: userId,
  });

  await DocumentVersion.create({
    documentId: document._id,
    version: 1,
    fileUrl: file.path,
    fileSize: file.size,
    createdBy: userId,
  });

  return document;
};

const getById = async (companyId: string, documentId: string) => {
  const document = await Document.findOne({ _id: documentId, companyId }).populate('uploadedBy', 'firstName lastName');
  if (!document) throw new AppError(404, 'NOT_FOUND', 'Document not found');
  return document;
};

const update = async (companyId: string, documentId: string, data: Record<string, unknown>) => {
  const document = await Document.findOneAndUpdate({ _id: documentId, companyId }, data, {
    new: true,
    runValidators: true,
  });
  if (!document) throw new AppError(404, 'NOT_FOUND', 'Document not found');
  return document;
};

const remove = async (companyId: string, documentId: string) => {
  const document = await Document.findOneAndDelete({ _id: documentId, companyId });
  if (!document) throw new AppError(404, 'NOT_FOUND', 'Document not found');

  await Promise.all([
    DocumentVersion.deleteMany({ documentId }),
    DocumentShare.deleteMany({ documentId }),
  ]);

  return { success: true };
};

const download = async (companyId: string, documentId: string) => {
  const document = await Document.findOne({ _id: documentId, companyId });
  if (!document) throw new AppError(404, 'NOT_FOUND', 'Document not found');
  return document;
};

const share = async (companyId: string, documentId: string, data: Record<string, unknown>, _userId: string) => {
  const document = await Document.findOne({ _id: documentId, companyId });
  if (!document) throw new AppError(404, 'NOT_FOUND', 'Document not found');

  const shares = [];
  if ((data.userIds as string[])?.length > 0) {
    for (const targetUserId of data.userIds as string[]) {
      const existing = await DocumentShare.findOne({ documentId, userId: targetUserId });
      if (existing) {
        existing.access = (data.access as string) || 'VIEW';
        await existing.save();
        shares.push(existing);
      } else {
        const share = await DocumentShare.create({
          documentId,
          userId: targetUserId,
          access: (data.access as string) || 'VIEW',
        });
        shares.push(share);
      }
    }
  }

  if (data.generateLink && !document.shareToken) {
    const shareToken = crypto.randomBytes(32).toString('hex');
    document.shareToken = shareToken;
    document.isShared = true;
    await document.save();
  } else if (data.generateLink && document.shareToken) {
    document.isShared = true;
    await document.save();
  }

  return { shares, shareToken: document.shareToken, isShared: document.isShared };
};

const getVersions = async (companyId: string, documentId: string) => {
  const document = await Document.findOne({ _id: documentId, companyId });
  if (!document) throw new AppError(404, 'NOT_FOUND', 'Document not found');

  const versions = await DocumentVersion.find({ documentId }).sort({ version: -1 });
  return versions;
};

const restoreVersion = async (companyId: string, documentId: string, versionNumber: string) => {
  const document = await Document.findOne({ _id: documentId, companyId });
  if (!document) throw new AppError(404, 'NOT_FOUND', 'Document not found');

  const version = await DocumentVersion.findOne({ documentId, version: parseInt(versionNumber) });
  if (!version) throw new AppError(404, 'NOT_FOUND', 'Version not found');

  const newVersion = (document.version || 0) + 1;
  await DocumentVersion.create({
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

const search = async (companyId: string, query: Record<string, unknown> = {}) => {
  const { page, limit, skip } = paginateQuery(query.page as string, Number(query.limit));
  const filter: Record<string, unknown> = { companyId };

  if (query.q) {
    const searchFilter = buildSearchQuery(query.q as string, ['name', 'description', 'tags']);
    Object.assign(filter, searchFilter);
  }
  if (query.tags) {
    filter.tags = { $in: Array.isArray(query.tags) ? query.tags : [query.tags] };
  }
  if (query.mimeType) filter.mimeType = query.mimeType;
  if (query.folderId) filter.folderId = query.folderId;

  const [data, total] = await Promise.all([
    Document.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('uploadedBy', 'firstName lastName'),
    Document.countDocuments(filter),
  ]);

  return { data, meta: buildMeta(total, page, limit) };
};

export {
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
