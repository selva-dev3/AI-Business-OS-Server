interface ChatMessage {
    role: string;
    content: string;
}
interface ChatResult {
    message: ChatMessage;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
interface Insight {
    type: string;
    title: string;
    description: string;
    confidence: number;
    recommendation: string;
}
interface SummaryResult {
    summary: string;
    keyPoints: string[];
    sentiment: string;
    confidence: number;
}
interface EmailData {
    type: string;
    recipient: string;
    subject?: string;
    keyPoints: string[];
    tone?: string;
}
interface EmailResult {
    to: string;
    subject: string;
    body: string;
    tone?: string;
    generatedAt: string;
}
interface FileInput {
    originalname: string;
    size: number;
    mimetype: string;
    path: string;
}
interface OCRResult {
    fileName: string;
    fileSize: number;
    fileType: string;
    processedAt: string;
    text: string;
    metadata: {
        pages: number;
        language: string;
        confidence: number;
    };
    fields: Record<string, unknown>;
}
interface HistoricalDataPoint {
    period: string;
    value: number;
}
interface ForecastResult {
    label: string;
    historicalData: HistoricalDataPoint[];
    forecastData: {
        period: string;
        forecast: number;
    }[];
    model: {
        type: string;
        slope: number;
        intercept: number;
        rSquared: number;
    };
    confidence: number;
    generatedAt: string;
}
interface ResumeParseResult {
    fileName: string;
    processedAt: string;
    parsedData: {
        personalInfo: {
            fullName: string;
            email: string;
            phone: string;
            location: string;
            linkedIn: string;
        };
        skills: string[];
        experience: {
            company: string;
            title: string;
            from: string;
            to: string;
            description: string;
        }[];
        education: {
            institution: string;
            degree: string;
            field: string;
            from: string;
            to: string;
        }[];
        certifications: string[];
        languages: string[];
        totalYearsOfExperience: number;
        summary: string;
    };
    confidence: number;
}
declare const chat: (messages: ChatMessage[], context: string) => Promise<ChatResult>;
declare const getInsights: (module: string, _data: Record<string, unknown>) => Promise<Insight[]>;
declare const summarize: (entityType: string, entityId: string) => Promise<SummaryResult>;
declare const generateEmail: (data: EmailData) => Promise<EmailResult>;
declare const extractDocument: (file: FileInput) => Promise<OCRResult>;
declare const forecast: (historicalData: HistoricalDataPoint[], periods: number) => Promise<ForecastResult>;
declare const parseResume: (file: FileInput) => Promise<ResumeParseResult>;
export { chat, getInsights, summarize, generateEmail, extractDocument, forecast, parseResume, };
//# sourceMappingURL=ai.service.d.ts.map