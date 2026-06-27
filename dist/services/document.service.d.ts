declare const listRoot: (companyId: string) => Promise<{
    folders: (import("mongoose").Document<unknown, {}, import("../models/DocumentFolder").IDocumentFolder, {}, {}> & import("../models/DocumentFolder").IDocumentFolder & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    unclassified: (import("mongoose").Document<unknown, {}, import("../models/Document").IDocument, {}, {}> & import("../models/Document").IDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>;
declare const getFolderById: (companyId: string, folderId: string) => Promise<{
    folder: import("mongoose").Document<unknown, {}, import("../models/DocumentFolder").IDocumentFolder, {}, {}> & import("../models/DocumentFolder").IDocumentFolder & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    };
    subfolders: (import("mongoose").Document<unknown, {}, import("../models/DocumentFolder").IDocumentFolder, {}, {}> & import("../models/DocumentFolder").IDocumentFolder & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    documents: (import("mongoose").Document<unknown, {}, import("../models/Document").IDocument, {}, {}> & import("../models/Document").IDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
}>;
declare const createFolder: (companyId: string, userId: string, data: {
    name: string;
    parentId?: string;
}) => Promise<import("mongoose").Document<unknown, {}, import("../models/DocumentFolder").IDocumentFolder, {}, {}> & import("../models/DocumentFolder").IDocumentFolder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const updateFolder: (companyId: string, folderId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/DocumentFolder").IDocumentFolder, {}, {}> & import("../models/DocumentFolder").IDocumentFolder & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const removeFolder: (companyId: string, folderId: string) => Promise<{
    success: boolean;
}>;
declare const list: (companyId: string, query?: Record<string, unknown>) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../models/Document").IDocument, {}, {}> & import("../models/Document").IDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
declare const create: (companyId: string, userId: string, data: Record<string, unknown>, file: {
    originalname: string;
    path: string;
    size: number;
    mimetype: string;
}) => Promise<import("mongoose").Document<unknown, {}, import("../models/Document").IDocument, {}, {}> & import("../models/Document").IDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const getById: (companyId: string, documentId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Document").IDocument, {}, {}> & import("../models/Document").IDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const update: (companyId: string, documentId: string, data: Record<string, unknown>) => Promise<import("mongoose").Document<unknown, {}, import("../models/Document").IDocument, {}, {}> & import("../models/Document").IDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const remove: (companyId: string, documentId: string) => Promise<{
    success: boolean;
}>;
declare const download: (companyId: string, documentId: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Document").IDocument, {}, {}> & import("../models/Document").IDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const share: (companyId: string, documentId: string, data: Record<string, unknown>, _userId: string) => Promise<{
    shares: (import("mongoose").Document<unknown, {}, import("../models/DocumentShare").IDocumentShare, {}, {}> & import("../models/DocumentShare").IDocumentShare & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    shareToken: string | undefined;
    isShared: boolean | undefined;
}>;
declare const getVersions: (companyId: string, documentId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/DocumentVersion").IDocumentVersion, {}, {}> & import("../models/DocumentVersion").IDocumentVersion & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
})[]>;
declare const restoreVersion: (companyId: string, documentId: string, versionNumber: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/Document").IDocument, {}, {}> & import("../models/Document").IDocument & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
declare const search: (companyId: string, query?: Record<string, unknown>) => Promise<{
    data: (import("mongoose").Document<unknown, {}, import("../models/Document").IDocument, {}, {}> & import("../models/Document").IDocument & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[];
    meta: import("../types").BuildMetaResult;
}>;
export { listRoot, getFolderById, createFolder, updateFolder, removeFolder, list, create, getById, update, remove, download, share, getVersions, restoreVersion, search, };
//# sourceMappingURL=document.service.d.ts.map